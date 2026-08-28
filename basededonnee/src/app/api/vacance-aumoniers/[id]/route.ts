import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [result, detailsResult, photoResult] = await Promise.all([
      supabase.from('vacance_aumonier').select('*').eq('id', id).maybeSingle(),
      supabase.from('detail_aumonier_vacance').select('*').eq('aumonier_id', id).maybeSingle(),
      supabase.from('photos').select('public_url').eq('vacance_aumonier_id', id).maybeSingle(),
    ]);

    if (result.error) throw result.error;
    if (!result.data) {
      return NextResponse.json({ success: false, message: 'Aumônier vacance non trouvé' }, { status: 404 });
    }

    const { id: _detailsId, ...detailFields } = detailsResult.data || {};

    return NextResponse.json({
      success: true,
      aumonier: {
        ...result.data,
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
      .from('vacance_aumonier')
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
    const { error } = await supabase.from('vacance_aumonier').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Aumônier vacance supprimé' });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
