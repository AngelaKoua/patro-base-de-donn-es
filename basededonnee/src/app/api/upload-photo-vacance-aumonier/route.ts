import { NextRequest, NextResponse } from 'next/server';
import { handlePhotoUpload } from '@/lib/photo-upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('photo') as File | null;
    const entityId = parseInt(formData.get('aumonier_id') as string);

    if (!file) return NextResponse.json({ success: false, message: 'Aucune photo fournie' }, { status: 400 });
    if (isNaN(entityId)) return NextResponse.json({ success: false, message: 'ID invalide' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await handlePhotoUpload({
      fileBuffer: buffer,
      mimetype: file.type,
      originalname: file.name,
      entityId,
      entityType: 'vacance_aumonier',
      tableName: 'vacance_aumonier',
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
