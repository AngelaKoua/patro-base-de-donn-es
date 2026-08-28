import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enfant_id, nombre_presences, nombre_presences_total, ...rest } = body;

    if (!enfant_id) {
      return NextResponse.json({ success: false, message: 'enfant_id requis' }, { status: 400 });
    }

    const toIntOrNull = (value: unknown) =>
      value === '' || value === null || value === undefined ? null : Number(value);

    const { data, error } = await supabase
      .from('details_enfants_scolaire')
      .upsert([{
        enfant_id,
        ...rest,
        nombre_presences: toIntOrNull(nombre_presences),
        nombre_presences_total: toIntOrNull(nombre_presences_total),
      }], { onConflict: 'enfant_id' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, details: data });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
