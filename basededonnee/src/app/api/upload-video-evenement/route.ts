import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File | null;
    const evenementId = parseInt((formData.get('evenementId') || formData.get('evenement_id')) as string);

    if (!file) return NextResponse.json({ success: false, message: 'Aucune vidéo fournie' }, { status: 400 });
    if (isNaN(evenementId)) return NextResponse.json({ success: false, message: 'ID événement invalide' }, { status: 400 });

    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const fileName = `scolaire-event-${evenementId}-video-${timestamp}.${ext}`;
    const filePath = `scolaire/${evenementId}/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('evenements-videos')
      .upload(filePath, buffer, { cacheControl: '3600', contentType: file.type, upsert: false });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('evenements-videos').getPublicUrl(filePath);
    const videoUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from('detail_evenement_scolaire')
      .update({ video: videoUrl })
      .eq('evenement_id', evenementId);

    if (updateError) {
      await supabase.storage.from('evenements-videos').remove([filePath]);
      throw updateError;
    }

    return NextResponse.json({ success: true, message: 'Vidéo uploadée avec succès', data: { videoUrl, filename: fileName, type: file.type, size: file.size } });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
