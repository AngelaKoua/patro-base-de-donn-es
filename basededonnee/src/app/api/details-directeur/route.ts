import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { directeur_id, ...rest } = body;

    if (!directeur_id) {
      return NextResponse.json({ success: false, message: 'directeur_id requis' }, { status: 400 });
    }

    const email = rest.email && rest.email.trim() ? rest.email.trim() : null;

    const { data, error } = await supabase
      .from('details_directeurs_scolaire')
      .upsert([{ directeur_id, ...rest, email }], { onConflict: 'directeur_id' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, details: data });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
