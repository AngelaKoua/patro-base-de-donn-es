import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [enfantResult, detailsResult, photoResult] = await Promise.all([
      supabase.from('enfants_vacance').select('*').eq('id', id).maybeSingle(),
      supabase.from('details_enfant_vacance').select('*').eq('enfant_id', id).maybeSingle(),
      supabase.from('photos').select('public_url').eq('vacance_enfant_id', id).maybeSingle(),
    ]);

    if (enfantResult.error) throw enfantResult.error;
    if (!enfantResult.data) {
      return NextResponse.json({ success: false, message: 'Enfant vacance non trouvé' }, { status: 404 });
    }

    const { id: _detailsId, ...detailFields } = detailsResult.data || {};

    return NextResponse.json({
      success: true,
      enfant: {
        ...enfantResult.data,
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
      .from('enfants_vacance')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, enfant: data });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabase.from('enfants_vacance').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Enfant vacance supprimé' });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
