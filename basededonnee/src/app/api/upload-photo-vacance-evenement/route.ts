import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('photo') as File | null;
    const evenementId = parseInt(formData.get('evenement_id') as string);
    const photoIndex = parseInt(formData.get('index') as string);

    if (!file) return NextResponse.json({ success: false, message: 'Aucune photo fournie' }, { status: 400 });
    if (isNaN(evenementId) || isNaN(photoIndex)) {
      return NextResponse.json({ success: false, message: 'ID événement ou index invalide' }, { status: 400 });
    }

    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const fileName = `vacance-event-${evenementId}-photo${photoIndex + 1}-${timestamp}.${ext}`;
    const filePath = `evenements/vacance/${evenementId}/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, { cacheControl: '3600', contentType: file.type, upsert: false });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
    const photoUrl = urlData.publicUrl;

    const photoColumn = `photo${photoIndex + 1}`;
    const { error: updateError } = await supabase
      .from('detail_evenement_vacance')
      .update({ [photoColumn]: photoUrl })
      .eq('evenement_id', evenementId);

    if (updateError) {
      await supabase.storage.from('images').remove([filePath]);
      throw updateError;
    }

    return NextResponse.json({ success: true, message: 'Photo uploadée avec succès', photoUrl, index: photoIndex });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
