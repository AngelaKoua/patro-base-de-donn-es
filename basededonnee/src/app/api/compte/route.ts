import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { authCookieOptions, getUtilisateurConnecte, signerToken, verifierMotDePasse } from '@/lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function erreur(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

function messageErreur(err: unknown) {
  return (err instanceof Error ? err.message : (err as { message?: string })?.message) || 'Erreur serveur';
}

// Informations du compte connecté
export async function GET(request: NextRequest) {
  try {
    const userId = getUtilisateurConnecte(request);
    if (!userId) return erreur('Session expirée, veuillez vous reconnecter', 401);

    const { data: user, error } = await supabase
      .from('utilisateurs')
      .select('id, email')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!user) return erreur('Compte introuvable', 404);

    return NextResponse.json({ success: true, user });
  } catch (err: unknown) {
    return erreur(messageErreur(err), 500);
  }
}

// Modification de l'email et/ou du mot de passe du compte connecté (mot de passe actuel obligatoire)
export async function PUT(request: NextRequest) {
  try {
    const userId = getUtilisateurConnecte(request);
    if (!userId) return erreur('Session expirée, veuillez vous reconnecter', 401);

    const body = await request.json();
    const motDePasseActuel = typeof body.mot_de_passe_actuel === 'string' ? body.mot_de_passe_actuel : '';
    const nouvelEmail = typeof body.nouvel_email === 'string' ? body.nouvel_email.trim().toLowerCase() : '';
    const nouveauMotDePasse = typeof body.nouveau_mot_de_passe === 'string' ? body.nouveau_mot_de_passe : '';

    if (!motDePasseActuel) return erreur('Le mot de passe actuel est requis', 400);
    if (!nouvelEmail && !nouveauMotDePasse) return erreur('Aucune modification demandée', 400);
    if (nouvelEmail && !EMAIL_REGEX.test(nouvelEmail)) return erreur('Nouvel email invalide', 400);
    if (nouveauMotDePasse && nouveauMotDePasse.length < 6) {
      return erreur('Le nouveau mot de passe doit contenir au moins 6 caractères', 400);
    }

    const { data: user, error: userError } = await supabase
      .from('utilisateurs')
      .select('id, email, mot_de_passe')
      .eq('id', userId)
      .maybeSingle();

    if (userError) throw userError;
    if (!user) return erreur('Compte introuvable', 404);

    if (!(await verifierMotDePasse(user.email, motDePasseActuel, user.mot_de_passe))) {
      return erreur('Mot de passe actuel incorrect', 403);
    }

    const modifications: { email?: string; mot_de_passe?: string } = {};

    if (nouvelEmail && nouvelEmail !== user.email) {
      const { data: existant, error: existantError } = await supabase
        .from('utilisateurs')
        .select('id')
        .eq('email', nouvelEmail)
        .maybeSingle();
      if (existantError) throw existantError;
      if (existant) return erreur('Cet email est déjà utilisé par un autre compte', 409);
      modifications.email = nouvelEmail;
    }

    if (nouveauMotDePasse) {
      modifications.mot_de_passe = await bcrypt.hash(nouveauMotDePasse, 10);
    }

    if (Object.keys(modifications).length === 0) {
      return erreur('Aucune modification demandée', 400);
    }

    const { error: updateError } = await supabase.from('utilisateurs').update(modifications).eq('id', userId);
    if (updateError) throw updateError;

    // Nouveau jeton de session, qui remplace l'ancien
    const email = modifications.email ?? user.email;
    const token = signerToken(userId, email);
    await supabase.from('access_token').delete().eq('user_id', userId);
    await supabase.from('access_token').insert([{
      user_id: userId,
      token,
      expires_at: new Date(Date.now() + 3600000).toISOString(),
    }]);

    const response = NextResponse.json({ success: true, message: 'Compte mis à jour', email });
    response.cookies.set('authToken', token, authCookieOptions);
    return response;
  } catch (err: unknown) {
    return erreur(messageErreur(err), 500);
  }
}
