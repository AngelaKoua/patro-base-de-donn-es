import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    if (!file) return NextResponse.json({ success: false, message: 'Aucun fichier fourni' }, { status: 400 });

    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const fileName = `test_${timestamp}.${ext}`;
    const filePath = `test/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, { contentType: file.type, upsert: true });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    const { data, error } = await supabase
      .from('test_images')
      .insert([{ file_path: filePath, public_url: publicUrl, original_name: file.name, mime_type: file.type }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, image: data, publicUrl });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
