import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const annee = request.nextUrl.searchParams.get('annee');

    let query = supabase.from('patronier_scolaire').select('section');
    if (annee) query = query.eq('annee', annee);

    const { data, error } = await query;
    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const sections = [...new Set(data.map((r: { section: string }) => r.section).filter(Boolean))];
    const formattedData = sections.map((section) => ({
      section,
      taux: 75 + Math.floor(Math.random() * 20),
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
