import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [aumonierResult, detailsResult, photoResult] = await Promise.all([
      supabase.from('scolaire_aumonier').select('*').eq('id', id).maybeSingle(),
      supabase.from('details_aumonier_scolaire').select('*').eq('aumonier_id', id).maybeSingle(),
      supabase.from('photos').select('public_url').eq('aumonier_id', id).maybeSingle(),
    ]);

    if (aumonierResult.error) throw aumonierResult.error;
    if (!aumonierResult.data) {
      return NextResponse.json({ success: false, message: 'Aumônier non trouvé' }, { status: 404 });
    }

    const { id: _detailsId, ...detailFields } = detailsResult.data || {};

    return NextResponse.json({
      success: true,
      aumonier: {
        ...aumonierResult.data,
        ...detailFields,
        photo_url: photoResult.data?.public_url || null,
      },
    });
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
      .from('scolaire_aumonier')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, aumonier: data });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabase.from('scolaire_aumonier').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Aumônier supprimé' });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
