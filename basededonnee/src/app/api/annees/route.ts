import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('patronier_scolaire')
      .select('annee')
      .order('annee', { ascending: false });

    if (error) throw error;

    const annees = [...new Set((data || []).map((r: { annee: number }) => r.annee))];
    return NextResponse.json({ success: true, annees });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
