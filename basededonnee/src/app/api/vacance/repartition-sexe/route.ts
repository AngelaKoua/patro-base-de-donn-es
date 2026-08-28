import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const annee = request.nextUrl.searchParams.get('annee');
    if (!annee) return NextResponse.json({ success: false, message: 'Année requise' }, { status: 400 });

    const { data, error } = await supabase
      .from('enfants_vacance')
      .select('sexe')
      .eq('annee', annee)
      .or('sexe.eq.F,sexe.eq.M');

    if (error) throw error;

    const sexes = { F: 0, M: 0 };
    (data || []).forEach((row: { sexe: string }) => {
      const s = row.sexe.trim().toUpperCase();
      if (s === 'F') sexes.F++;
      if (s === 'M') sexes.M++;
    });

    return NextResponse.json({
      success: true,
      data: [{ sexe: 'F', count: sexes.F }, { sexe: 'M', count: sexes.M }],
    });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
