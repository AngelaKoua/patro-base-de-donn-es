import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [enfantResult, detailsResult, photoResult] = await Promise.all([
      supabase.from('patronier_scolaire').select('*').eq('id', id).maybeSingle(),
      supabase.from('details_enfants_scolaire').select('*').eq('enfant_id', id).maybeSingle(),
      supabase.from('photos').select('public_url').eq('enfant_id', id).maybeSingle(),
    ]);

    if (enfantResult.error) throw enfantResult.error;
    if (!enfantResult.data) {
      return NextResponse.json({ success: false, message: 'Enfant non trouvé' }, { status: 404 });
    }

    const detail = detailsResult.data ? (() => {
      const { id: _id, ...rest } = detailsResult.data;
      return rest;
    })() : null;

    return NextResponse.json({
      success: true,
      enfant: {
        ...enfantResult.data,
        ...(detail || {}),
        photo_url: photoResult.data?.public_url || null,
      },
    });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
