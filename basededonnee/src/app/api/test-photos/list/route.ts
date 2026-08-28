import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .is('enfant_id', null)
      .is('animateur_id', null)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, photos: data || [] });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
