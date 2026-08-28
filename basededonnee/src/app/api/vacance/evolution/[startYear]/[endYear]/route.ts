import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ startYear: string; endYear: string }> }) {
  try {
    const { startYear, endYear } = await params;

    const { data, error } = await supabase
      .from('enfants_vacance')
      .select('annee, sexe')
      .gte('annee', startYear)
      .lte('annee', endYear);

    if (error) throw error;

    const evolution: Record<number, { total: number; filles: number; garcons: number }> = {};
    (data || []).forEach((row: { annee: number; sexe: string }) => {
      if (row.annee == null) return;
      if (!evolution[row.annee]) evolution[row.annee] = { total: 0, filles: 0, garcons: 0 };
      evolution[row.annee].total++;
      if (row.sexe) {
        const s = row.sexe.trim().toUpperCase();
        if (s === 'F') evolution[row.annee].filles++;
        if (s === 'M') evolution[row.annee].garcons++;
      }
    });

    const formattedEvolution = Object.entries(evolution)
      .map(([annee, stats]) => ({ annee: Number(annee), ...stats }))
      .filter((e) => e.annee > 0)
      .sort((a, b) => a.annee - b.annee);

    return NextResponse.json({
      success: true,
      data: {
        evolution: formattedEvolution,
        labels: formattedEvolution.map((d) => d.annee.toString()),
        total: formattedEvolution.map((d) => d.total),
        filles: formattedEvolution.map((d) => d.filles),
        garcons: formattedEvolution.map((d) => d.garcons),
      },
    });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
