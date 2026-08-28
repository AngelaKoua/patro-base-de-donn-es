import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('enfants_vacance')
      .select('*')
      .order('annee', { ascending: false })
      .order('nom', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, enfants: data || [] });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
