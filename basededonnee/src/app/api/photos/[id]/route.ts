import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { deletePhotoByEntityId } from '@/lib/photo-upload';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('photos')
      .select('public_url')
      .eq('enfant_id', id)
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({ success: true, photo: data });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deletePhotoByEntityId('enfant', parseInt(id));
    return NextResponse.json({ success: true, message: 'Photo supprimée' });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
