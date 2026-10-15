import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authCookieOptions, getJwtSecret, signerToken, verifierMotDePasse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    getJwtSecret();

    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const { mot_de_passe } = body;

    if (!email || !mot_de_passe) {
      return NextResponse.json({ Error: true, Message: 'Email et mot de passe requis' }, { status: 400 });
    }

    const { data: user, error: userError } = await supabase
      .from('utilisateurs')
      .select('id, email, mot_de_passe')
      .eq('email', email)
      .maybeSingle();

    if (userError) throw userError;

    const isValid = await verifierMotDePasse(email, mot_de_passe, user?.mot_de_passe);

    if (!user || !isValid) {
      return NextResponse.json({ Error: true, Message: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    const token = signerToken(user.id, email);

    await supabase.from('access_token').delete().eq('user_id', user.id);
    await supabase.from('access_token').insert([{
      user_id: user.id,
      token,
      expires_at: new Date(Date.now() + 3600000).toISOString(),
    }]);

    const response = NextResponse.json({
      Error: false,
      userId: user.id,
      email,
      message: 'Connexion réussie',
      token,
    });

    response.cookies.set('authToken', token, authCookieOptions);

    return response;
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ Error: true, Message: message }, { status: 500 });
  }
}
