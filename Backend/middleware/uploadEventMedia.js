// middleware/uploadEventMedia.js
const multer = require('multer');
const supabase = require('../config/supabase');

const storage = multer.memoryStorage();

// Upload pour photos (même config que genericPhotoMiddleware)
const uploadPhoto = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Seules les images sont autorisées'));
        }
        cb(null, true);
    }
}).single('photo');

// Upload pour vidéos
const uploadVideo = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB pour ~3 min
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('video/')) {
            return cb(new Error('Seules les vidéos sont autorisées'));
        }
        cb(null, true);
    }
}).single('video');

/**
 * Upload photo pour événement
 * @param {string} type - 'scolaire' ou 'vacance'
 */
const createPhotoUploader = (type) => async (req, res) => {
    uploadPhoto(req, res, async (err) => {
        if (err) {
            console.error('❌ Erreur Multer:', err);
            return res.status(500).json({
                success: false,
                message: 'Erreur lors du téléchargement: ' + err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucune photo fournie'
            });
        }

        const evenementId = parseInt(req.body.evenement_id);
        const photoIndex = parseInt(req.body.index);

        if (isNaN(evenementId) || isNaN(photoIndex)) {
            return res.status(400).json({
                success: false,
                message: 'ID événement ou index invalide'
            });
        }

        try {
            console.log(`📸 Upload photo #${photoIndex + 1} pour événement ${type} #${evenementId}`);

            const timestamp = Date.now();
            const ext = req.file.originalname.split('.').pop();
            const fileName = `${type}-event-${evenementId}-photo${photoIndex + 1}-${timestamp}.${ext}`;

            // ✅ CORRECTION : Utiliser le bucket "images" (même que genericPhotoMiddleware)
            const filePath = `evenements/${type}/${evenementId}/${fileName}`;

            console.log(`📤 Upload vers images/${filePath}`);

            // ✅ Upload vers le bucket "images" (PAS "evenements-photos")
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('images')  // ← BUCKET "IMAGES" ICI !
                .upload(filePath, req.file.buffer, {
                    cacheControl: '3600',
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) {
                console.error('❌ Erreur Supabase Storage:', uploadError);
                throw uploadError;
            }

            console.log('✅ Upload réussi:', uploadData);

            // Récupérer l'URL publique depuis le bucket "images"
            const { data: urlData } = supabase.storage
                .from('images')  // ← BUCKET "IMAGES" ICI AUSSI !
                .getPublicUrl(filePath);

            const photoUrl = urlData.publicUrl;
            console.log('🔗 URL publique:', photoUrl);

            // Nom de la table selon le type
            const tableName = type === 'scolaire'
                ? 'detail_evenement_scolaire'
                : 'detail_evenement_vacance';

            // Mettre à jour la colonne photo correspondante
            const photoColumn = `photo${photoIndex + 1}`;
            const { error: updateError } = await supabase
                .from(tableName)
                .update({ [photoColumn]: photoUrl })
                .eq('evenement_id', evenementId);

            if (updateError) {
                console.error('❌ Erreur mise à jour DB:', updateError);
                // Nettoyer le fichier uploadé si la mise à jour échoue
                await supabase.storage
                    .from('images')
                    .remove([filePath]);
                throw updateError;
            }

            console.log(`✅ Photo ${photoIndex + 1} sauvegardée pour événement ${type} #${evenementId}`);

            res.json({
                success: true,
                message: 'Photo uploadée avec succès',
                photoUrl,
                index: photoIndex
            });

        } catch (error) {
            console.error('❌ Erreur upload photo:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la sauvegarde de la photo'
            });
        }
    });
};

/**
 * Upload vidéo pour événement
 * @param {string} type - 'scolaire' ou 'vacance'
 */
const createVideoUploader = (type) => async (req, res) => {
    uploadVideo(req, res, async (err) => {
        if (err) {
            console.error('❌ Erreur Multer:', err);
            return res.status(500).json({
                success: false,
                message: 'Erreur lors du téléchargement: ' + err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucune vidéo fournie'
            });
        }

        const evenementId = parseInt(req.body.evenementId || req.body.evenement_id);

        if (isNaN(evenementId)) {
            return res.status(400).json({
                success: false,
                message: 'ID événement invalide'
            });
        }

        try {
            console.log(`🎥 Upload vidéo pour événement ${type} #${evenementId}`);

            const timestamp = Date.now();
            const ext = req.file.originalname.split('.').pop();
            const fileName = `${type}-event-${evenementId}-video-${timestamp}.${ext}`;
            const filePath = `${type}/${evenementId}/${fileName}`;

            console.log(`📤 Upload vers evenements-videos/${filePath}`);

            // Upload vers Supabase Storage - bucket "evenements-videos"
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('evenements-videos')
                .upload(filePath, req.file.buffer, {
                    cacheControl: '3600',
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) {
                console.error('❌ Erreur Supabase Storage:', uploadError);
                throw uploadError;
            }

            console.log('✅ Upload réussi:', uploadData);

            const { data: urlData } = supabase.storage
                .from('evenements-videos')
                .getPublicUrl(filePath);

            const videoUrl = urlData.publicUrl;
            console.log('🔗 URL publique:', videoUrl);

            // Nom de la table selon le type
            const tableName = type === 'scolaire'
                ? 'detail_evenement_scolaire'
                : 'detail_evenement_vacance';

            // Mettre à jour la colonne video
            const { error: updateError } = await supabase
                .from(tableName)
                .update({ video: videoUrl })
                .eq('evenement_id', evenementId);

            if (updateError) {
                console.error('❌ Erreur mise à jour DB:', updateError);
                // Nettoyer le fichier uploadé si la mise à jour échoue
                await supabase.storage
                    .from('evenements-videos')
                    .remove([filePath]);
                throw updateError;
            }

            console.log(`✅ Vidéo sauvegardée pour événement ${type} #${evenementId}`);

            res.json({
                success: true,
                message: 'Vidéo uploadée avec succès',
                data: {
                    videoUrl,
                    filename: fileName,
                    type: req.file.mimetype,
                    size: req.file.size
                }
            });

        } catch (error) {
            console.error('❌ Erreur upload vidéo:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la sauvegarde de la vidéo'
            });
        }
    });
};

// Export
module.exports = {
    // Photos - utilisent le bucket "images"
    uploadPhotoScolaire: createPhotoUploader('scolaire'),
    uploadPhotoVacance: createPhotoUploader('vacance'),

    // Vidéos - utilisent le bucket "evenements-videos"
    uploadVideoScolaire: createVideoUploader('scolaire'),
    uploadVideoVacance: createVideoUploader('vacance')
};