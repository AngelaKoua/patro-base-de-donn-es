import { NextRequest, NextResponse } from 'next/server';
import { deletePhotoByEntityId } from '@/lib/photo-upload';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deletePhotoByEntityId('animateur', parseInt(id));
    return NextResponse.json({ success: true, message: 'Photo supprimée' });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
