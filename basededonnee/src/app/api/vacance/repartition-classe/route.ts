import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const annee = request.nextUrl.searchParams.get('annee');
    if (!annee) return NextResponse.json({ success: false, message: 'Année requise' }, { status: 400 });

    const { data, error } = await supabase
      .from('enfants_vacance')
      .select('section')
      .eq('annee', annee);

    if (error) throw error;

    const sectionCounts: Record<string, number> = {};
    (data || []).forEach((row: { section: string }) => {
      sectionCounts[row.section] = (sectionCounts[row.section] || 0) + 1;
    });

    const formattedData = Object.entries(sectionCounts).map(([section, count]) => ({ section, count }));
    return NextResponse.json({ success: true, data: formattedData });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
