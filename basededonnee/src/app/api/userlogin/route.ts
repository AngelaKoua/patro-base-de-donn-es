import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET non configuré');
    }

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

    // Seuls les comptes ayant un mot de passe haché (bcrypt) dans Supabase peuvent se connecter.
    const isValid =
      !!user?.mot_de_passe &&
      user.mot_de_passe.startsWith('$2') &&
      (await bcrypt.compare(mot_de_passe, user.mot_de_passe));

    if (!user || !isValid) {
      return NextResponse.json({ Error: true, Message: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '1h' });

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

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 3600,
    });

    return response;
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ Error: true, Message: message }, { status: 500 });
  }
}
