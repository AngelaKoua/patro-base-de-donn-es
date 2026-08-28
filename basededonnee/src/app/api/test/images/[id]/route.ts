import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: image } = await supabase.from('test_images').select('file_path').eq('id', id).single();
    if (image?.file_path) {
      await supabase.storage.from('images').remove([image.file_path]);
    }
    await supabase.from('test_images').delete().eq('id', id);
    return NextResponse.json({ success: true, message: 'Image supprimée' });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
