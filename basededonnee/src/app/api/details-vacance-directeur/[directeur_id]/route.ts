import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest, { params }: { params: Promise<{ directeur_id: string }> }) {
  try {
    const { directeur_id } = await params;
    const body = await request.json();
    const email = body.email && body.email.trim() ? body.email.trim() : null;

    const { data, error } = await supabase
      .from('detail_directeur_vacance')
      .upsert([{ directeur_id: parseInt(directeur_id), ...body, email }], { onConflict: 'directeur_id' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, details: data });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
