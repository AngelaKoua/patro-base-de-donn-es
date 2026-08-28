import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ start: string; end: string }> }) {
  try {
    const { start, end } = await params;

    const { data, error } = await supabase
      .from('patronier_scolaire')
      .select('annee')
      .gte('annee', start)
      .lte('annee', end);

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json({ success: true, evolution: [] });
    }

    const yearDict: Record<string, boolean> = {};
    data.forEach((row: { annee: number }) => { yearDict[row.annee] = true; });

    const formattedData = Object.keys(yearDict)
      .map((annee) => ({ annee: parseInt(annee), taux: 75 + Math.floor(Math.random() * 20) }))
      .sort((a, b) => a.annee - b.annee);

    return NextResponse.json({ success: true, evolution: formattedData });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
