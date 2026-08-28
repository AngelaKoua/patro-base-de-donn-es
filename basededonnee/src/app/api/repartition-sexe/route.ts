import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const annee = request.nextUrl.searchParams.get('annee');

    let query = supabase.from('patronier_scolaire').select('sexe');
    if (annee) query = query.eq('annee', annee);

    const { data, error } = await query;
    if (error) throw error;

    const sexes = { F: 0, M: 0 };
    (data || []).forEach((row: { sexe: string }) => {
      if (!row.sexe) return;
      const s = row.sexe.trim().toUpperCase();
      if (s === 'F') sexes.F++;
      if (s === 'M') sexes.M++;
    });

    return NextResponse.json({
      success: true,
      data: [
        { sexe: 'F', count: sexes.F, label: 'Filles' },
        { sexe: 'M', count: sexes.M, label: 'Garçons' },
      ],
    });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
