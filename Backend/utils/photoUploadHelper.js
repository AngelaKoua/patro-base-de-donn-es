// utils/photoUploadHelper.js
const supabase = require('../config/supabase');

/**
 * Fonction utilitaire pour gérer l'upload de photos
 * @param {Object} options
 * @param {Buffer} options.fileBuffer - Le buffer du fichier
 * @param {string} options.mimetype - Type MIME
 * @param {string} options.originalname - Nom original
 * @param {number} options.entityId - ID de l'entité (enfant, animateur, etc.)
 * @param {string} options.entityType - Type d'entité (enfant, animateur, directeur, etc.)
 * @param {string} options.tableName - Nom de la table à vérifier
 * @returns {Promise<Object>}
 */
async function handlePhotoUpload(options) {
    const { fileBuffer, mimetype, originalname, entityId, entityType, tableName } = options;

    console.log(`📸 handlePhotoUpload: entityType="${entityType}", tableName="${tableName}", entityId=${entityId}`);

    // ✅ Vérifier que l'entité existe
    console.log(`🔍 Vérification existence dans ${tableName}...`);
    const { data: entity, error: entityError } = await supabase
        .from(tableName)
        .select('id')
        .eq('id', entityId)
        .maybeSingle();

    if (entityError) {
        console.error(`❌ Erreur vérification:`, entityError);
        throw new Error(`Erreur lors de la vérification: ${entityError.message}`);
    }

    if (!entity) {
        console.error(`❌ ${entityType} #${entityId} non trouvé dans ${tableName}`);
        throw new Error(`${entityType} non trouvé dans la base de données`);
    }

    console.log(`✅ ${entityType} #${entityId} existe`);

    // ✅ Générer le nom du fichier
    const fileExtension = originalname.split('.').pop();
    const fileName = `${entityType}_${entityId}_${Date.now()}.${fileExtension}`;
    const filePath = `photos/${fileName}`;

    console.log(`📁 Chemin fichier: ${filePath}`);

    // ✅ Vérifier photo existante
    console.log(`🔍 Recherche photo existante avec ${entityType}_id = ${entityId}`);
    const { data: existingPhoto } = await supabase
        .from('photos')
        .select('id, file_path')
        .eq(`${entityType}_id`, entityId)
        .maybeSingle();

    if (existingPhoto) {
        console.log(`📸 Photo existante trouvée: ${existingPhoto.file_path}`);
    }

    // ✅ Supprimer l'ancienne photo si elle existe
    if (existingPhoto?.file_path) {
        console.log(`🗑️ Suppression ancienne photo...`);
        await supabase.storage
            .from('images')
            .remove([existingPhoto.file_path]);
    }

    // ✅ Upload du nouveau fichier
    console.log(`⬆️ Upload vers Supabase Storage...`);
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, fileBuffer, {
            contentType: mimetype,
            upsert: true
        });

    if (uploadError) {
        console.error('❌ Erreur upload storage:', uploadError);
        throw uploadError;
    }

    console.log('✅ Fichier uploadé');

    // ✅ Obtenir l'URL publique
    const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;
    console.log(`🌐 URL publique: ${publicUrl}`);

    // ✅ Sauvegarder dans la table photos
    let photoData, dbError;
    const photoRecord = {
        [`${entityType}_id`]: entityId,
        file_path: filePath,
        public_url: publicUrl,
        mime_type: mimetype,
        updated_at: new Date().toISOString()
    };

    console.log('💾 Enregistrement dans la table photos avec:', photoRecord);

    if (existingPhoto?.id) {
        console.log(`🔄 Mise à jour photo existante ID: ${existingPhoto.id}`);
        const updateResult = await supabase
            .from('photos')
            .update(photoRecord)
            .eq('id', existingPhoto.id)
            .select();

        photoData = updateResult.data;
        dbError = updateResult.error;
    } else {
        console.log(`➕ Insertion nouvelle photo`);
        const insertResult = await supabase
            .from('photos')
            .insert([photoRecord])
            .select();

        photoData = insertResult.data;
        dbError = insertResult.error;
    }

    if (dbError) {
        console.error('❌ Erreur sauvegarde DB:', dbError);
        // Rollback: supprimer le fichier uploadé
        await supabase.storage.from('images').remove([filePath]);
        throw dbError;
    }

    console.log('✅ Photo enregistrée avec succès en base');

    return {
        publicUrl,
        photoData: photoData?.[0] || photoData,
        filePath,
        mimetype
    };
}

module.exports = { handlePhotoUpload };