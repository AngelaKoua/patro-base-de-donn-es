import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authCookieOptions, getUtilisateurConnecte } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = getUtilisateurConnecte(request);
    if (userId) {
      await supabase.from('access_token').delete().eq('user_id', userId);
    }
  } catch {
    // La déconnexion côté navigateur doit réussir même si la base est injoignable
  }

  const response = NextResponse.json({ success: true, message: 'Déconnexion réussie' });
  response.cookies.set('authToken', '', { ...authCookieOptions, maxAge: 0 });
  return response;
}
