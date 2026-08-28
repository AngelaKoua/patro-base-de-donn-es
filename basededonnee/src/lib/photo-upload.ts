import { supabase } from './supabase';

interface UploadOptions {
  fileBuffer: Buffer;
  mimetype: string;
  originalname: string;
  entityId: number;
  entityType: string;
  tableName: string;
}

export async function handlePhotoUpload(options: UploadOptions) {
  const { fileBuffer, mimetype, originalname, entityId, entityType, tableName } = options;

  const { data: entity, error: entityError } = await supabase
    .from(tableName)
    .select('id')
    .eq('id', entityId)
    .maybeSingle();

  if (entityError) throw new Error(`Erreur vérification: ${entityError.message}`);
  if (!entity) throw new Error(`${entityType} non trouvé dans la base de données`);

  const fileExtension = originalname.split('.').pop();
  const fileName = `${entityType}_${entityId}_${Date.now()}.${fileExtension}`;
  const filePath = `photos/${fileName}`;

  const { data: existingPhoto } = await supabase
    .from('photos')
    .select('id, file_path')
    .eq(`${entityType}_id`, entityId)
    .maybeSingle();

  if (existingPhoto?.file_path) {
    await supabase.storage.from('images').remove([existingPhoto.file_path]);
  }

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, fileBuffer, { contentType: mimetype, upsert: true });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
  const publicUrl = urlData.publicUrl;

  const photoRecord: Record<string, unknown> = {
    [`${entityType}_id`]: entityId,
    file_path: filePath,
    public_url: publicUrl,
    mime_type: mimetype,
    updated_at: new Date().toISOString(),
  };

  let photoData, dbError;
  if (existingPhoto?.id) {
    const result = await supabase.from('photos').update(photoRecord).eq('id', existingPhoto.id).select();
    photoData = result.data;
    dbError = result.error;
  } else {
    const result = await supabase.from('photos').insert([photoRecord]).select();
    photoData = result.data;
    dbError = result.error;
  }

  if (dbError) {
    await supabase.storage.from('images').remove([filePath]);
    throw dbError;
  }

  return { publicUrl, photoData: Array.isArray(photoData) ? photoData[0] : photoData, filePath };
}

export async function deletePhotoById(photoId: number) {
  const { data: photo, error } = await supabase
    .from('photos')
    .select('file_path')
    .eq('id', photoId)
    .single();

  if (error || !photo) throw new Error('Photo non trouvée');

  await supabase.storage.from('images').remove([photo.file_path]);

  const { error: deleteError } = await supabase.from('photos').delete().eq('id', photoId);
  if (deleteError) throw deleteError;
}

export async function deletePhotoByEntityId(entityType: string, entityId: number) {
  const { data: photo, error } = await supabase
    .from('photos')
    .select('id, file_path')
    .eq(`${entityType}_id`, entityId)
    .maybeSingle();

  if (error) throw error;
  if (!photo) return;

  await supabase.storage.from('images').remove([photo.file_path]);
  await supabase.from('photos').delete().eq('id', photo.id);
}
