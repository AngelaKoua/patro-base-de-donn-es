import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ startYear: string; endYear: string }> }) {
  try {
    const { startYear, endYear } = await params;

    const { data, error } = await supabase
      .from('patronier_scolaire')
      .select('annee, sexe')
      .gte('annee', startYear)
      .lte('annee', endYear);

    if (error) throw error;

    const grouped: Record<number, { total: number; filles: number; garcons: number }> = {};
    (data || []).forEach((row: { annee: number; sexe: string }) => {
      if (!grouped[row.annee]) grouped[row.annee] = { total: 0, filles: 0, garcons: 0 };
      grouped[row.annee].total++;
      if (row.sexe === 'F') grouped[row.annee].filles++;
      if (row.sexe === 'M') grouped[row.annee].garcons++;
    });

    const evolution = Object.entries(grouped)
      .map(([annee, stats]) => ({ annee: parseInt(annee), ...stats }))
      .sort((a, b) => a.annee - b.annee);

    return NextResponse.json({ success: true, evolution });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
