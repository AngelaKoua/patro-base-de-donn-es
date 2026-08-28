import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const annee = request.nextUrl.searchParams.get('annee');

    let query = supabase.from('patronier_scolaire').select('classe');
    if (annee) query = query.eq('annee', annee);

    const { data, error } = await query;
    if (error) throw error;

    const classeCounts: Record<string, number> = {};
    (data || []).forEach((row: { classe: string }) => {
      if (!row.classe) return;
      classeCounts[row.classe] = (classeCounts[row.classe] || 0) + 1;
    });

    const formattedData = Object.entries(classeCounts)
      .map(([classe, count]) => ({ classe, count }))
      .sort((a, b) => a.classe.localeCompare(b.classe));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
