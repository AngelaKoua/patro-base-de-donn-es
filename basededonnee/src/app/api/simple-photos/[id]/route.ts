import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: photo } = await supabase.from('simple_photos').select('file_path').eq('id', id).single();
    if (photo?.file_path) {
      await supabase.storage.from('images').remove([photo.file_path]);
    }
    await supabase.from('simple_photos').delete().eq('id', id);
    return NextResponse.json({ success: true, message: 'Photo supprimée' });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
