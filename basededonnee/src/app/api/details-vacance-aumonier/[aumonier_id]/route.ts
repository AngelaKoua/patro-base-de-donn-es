import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest, { params }: { params: Promise<{ aumonier_id: string }> }) {
  try {
    const { aumonier_id } = await params;
    const body = await request.json();
    const email = body.email && body.email.trim() ? body.email.trim() : null;

    const { data, error } = await supabase
      .from('detail_aumonier_vacance')
      .upsert([{ aumonier_id: parseInt(aumonier_id), ...body, email }], { onConflict: 'aumonier_id' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, details: data });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
