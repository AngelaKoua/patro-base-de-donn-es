import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET non configuré');
  }
  return secret;
}

// Seuls les comptes ayant un mot de passe haché (bcrypt) dans Supabase peuvent se connecter.
// Les hachages créés depuis le SQL Editor (pgcrypto) sont vérifiés par Postgres lui-même.
export async function verifierMotDePasse(email: string, motDePasse: string, hash: string | null | undefined): Promise<boolean> {
  if (!hash?.startsWith('$2')) return false;
  if (await bcrypt.compare(motDePasse, hash)) return true;

  const { data, error } = await supabase.rpc('verifier_mot_de_passe', {
    p_email: email,
    p_mot_de_passe: motDePasse,
  });
  if (error) throw error;
  return data === true;
}

// Renvoie l'id de l'utilisateur connecté d'après le cookie authToken, ou null si la session est absente ou expirée.
export function getUtilisateurConnecte(request: NextRequest): number | null {
  const token = request.cookies.get('authToken')?.value;
  if (!token) return null;
  const secret = getJwtSecret();
  try {
    const payload = jwt.verify(token, secret) as { id?: number };
    return typeof payload.id === 'number' ? payload.id : null;
  } catch {
    return null;
  }
}

export function signerToken(id: number, email: string): string {
  return jwt.sign({ id, email }, getJwtSecret(), { expiresIn: '1h' });
}

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
  maxAge: 3600,
};
