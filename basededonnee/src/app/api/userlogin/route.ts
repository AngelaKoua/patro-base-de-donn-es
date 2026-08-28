import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'patro-secret-key-2025';

const allowedUsers = [
  { email: 'kouaangela606@gmail.com', mot_de_passe: 'admin123' },
  { email: 'patrorsvbouake@gmail.com', mot_de_passe: 'patrorsv2025@' },
  { email: 'dialloba@gmail.com', mot_de_passe: 'diallo1123@' },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, mot_de_passe } = body;

    if (!email || !mot_de_passe) {
      return NextResponse.json({ Error: true, Message: 'Email et mot de passe requis' }, { status: 400 });
    }

    const allowedUser = allowedUsers.find((u) => u.email === email);
    if (!allowedUser) {
      return NextResponse.json({ Error: true, Message: 'Adresse email non autorisée' }, { status: 403 });
    }

    if (allowedUser.mot_de_passe !== mot_de_passe) {
      return NextResponse.json({ Error: true, Message: 'Mot de passe incorrect' }, { status: 401 });
    }

    const { data: user, error: userError } = await supabase
      .from('utilisateurs')
      .select('id, email, mot_de_passe, nom, prenom')
      .eq('email', email)
      .maybeSingle();

    if (userError) throw userError;

    if (!user) {
      return NextResponse.json({ Error: true, Message: 'Utilisateur non trouvé dans la base de données' }, { status: 404 });
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
