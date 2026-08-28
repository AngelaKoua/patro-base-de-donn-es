import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [animateurResult, detailsResult, photoResult] = await Promise.all([
      supabase.from('scolaire_animateur').select('*').eq('id', id).maybeSingle(),
      supabase.from('details_animateurs_scolaire').select('*').eq('animateur_id', id).maybeSingle(),
      supabase.from('photos').select('public_url').eq('animateur_id', id).maybeSingle(),
    ]);

    if (animateurResult.error) throw animateurResult.error;
    if (!animateurResult.data) {
      return NextResponse.json({ success: false, message: 'Animateur non trouvé' }, { status: 404 });
    }

    const { id: _detailsId, ...detailFields } = detailsResult.data || {};

    return NextResponse.json({
      success: true,
      animateur: {
        ...animateurResult.data,
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
      .from('scolaire_animateur')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, animateur: data });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabase.from('scolaire_animateur').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Animateur supprimé' });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
