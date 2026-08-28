import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [evenementResult, detailResult] = await Promise.all([
      supabase.from('evenement_vacance').select('*').eq('id', id).maybeSingle(),
      supabase.from('detail_evenement_vacance').select('*').eq('evenement_id', id).maybeSingle(),
    ]);

    if (evenementResult.error) throw evenementResult.error;
    if (!evenementResult.data) {
      return NextResponse.json({ success: false, message: 'Événement non trouvé' }, { status: 404 });
    }

    const detail = detailResult.data
      ? {
          ...detailResult.data,
          photos: [
            detailResult.data.photo1, detailResult.data.photo2, detailResult.data.photo3,
            detailResult.data.photo4, detailResult.data.photo5, detailResult.data.photo6,
            detailResult.data.photo7, detailResult.data.photo8, detailResult.data.photo9,
            detailResult.data.photo10,
          ].filter(Boolean),
          video: detailResult.data.video || '',
        }
      : null;

    return NextResponse.json({ success: true, evenement: evenementResult.data, detail });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('evenement_vacance')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, evenement: data });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabase.from('evenement_vacance').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Événement vacance supprimé' });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
