// middleware/genericPhotoMiddleware.js
const multer = require('multer');
const { handlePhotoUpload } = require('../utils/photoUploadHelper');
const supabase = require('../config/supabase');

// Configuration Multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Seules les images sont autorisées'));
        }
        cb(null, true);
    }
}).single('photo');

/**
 * Configuration pour chaque type d'entité
 * ✅ IMPORTANT : Les noms de tables doivent correspondre EXACTEMENT à Supabase
 */
const ENTITY_CONFIG = {
    // Scolaire
    'enfant': { table: 'patronier_scolaire', idField: 'enfant_id' },
    'animateur': { table: 'scolaire_animateur', idField: 'animateur_id' },
    'directeur': { table: 'scolaire_directeur', idField: 'directeur_id' },
    'aumonier': { table: 'scolaire_aumonier', idField: 'aumonier_id' },

    // Vacances - ✅ NOMS CORRECTS
    'vacance_enfant': { table: 'enfants_vacance', idField: 'enfant_id' },
    'vacance_animateur': { table: 'vacance_animateur', idField: 'animateur_id' },
    'vacance_directeur': { table: 'vacance_directeur', idField: 'directeur_id' },
    'vacance_aumonier': { table: 'vacance_aumonier', idField: 'aumonier_id' }
};

/**
 * 📤 Middleware générique pour l'UPLOAD de photos
 */
const createUploadMiddleware = (entityType) => {
    return async (req, res) => {
        const config = ENTITY_CONFIG[entityType];

        if (!config) {
            return res.status(400).json({
                success: false,
                message: `Type d'entité invalide: ${entityType}`
            });
        }

        upload(req, res, async (err) => {
            if (err) {
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

            // Récupérer l'ID depuis le body
            const entityId = parseInt(req.body[config.idField] || req.body.id);

            if (isNaN(entityId)) {
                return res.status(400).json({
                    success: false,
                    message: `ID ${entityType} invalide`
                });
            }

            try {
                console.log(`✅ Upload photo pour ${entityType} #${entityId}`);

                // 🔥 Utilise ta fonction helper avec le bon nom de table
                const result = await handlePhotoUpload({
                    fileBuffer: req.file.buffer,
                    mimetype: req.file.mimetype,
                    originalname: req.file.originalname,
                    entityId: entityId,
                    entityType: entityType,
                    tableName: config.table  // ✅ Envoie le bon nom de table
                });

                res.json({
                    success: true,
                    message: 'Photo téléchargée avec succès',
                    entityType: entityType,
                    entityId: entityId,
                    ...result
                });
            } catch (error) {
                console.error(`❌ Erreur upload ${entityType}:`, error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Erreur lors de la sauvegarde de la photo'
                });
            }
        });
    };
};

/**
 * 🗑️ Middleware générique pour la SUPPRESSION de photos
 */
const createDeleteMiddleware = (entityType) => {
    return async (req, res) => {
        const config = ENTITY_CONFIG[entityType];

        if (!config) {
            return res.status(400).json({
                success: false,
                message: `Type d'entité invalide: ${entityType}`
            });
        }

        const entityId = parseInt(req.params.id);

        if (isNaN(entityId)) {
            return res.status(400).json({
                success: false,
                message: 'ID invalide'
            });
        }

        try {
            // Récupérer la photo depuis la table photos
            const { data: photoRecord, error: fetchError } = await supabase
                .from('photos')
                .select('id, file_path')
                .eq(`${entityType}_id`, entityId)
                .maybeSingle();

            if (fetchError) throw fetchError;

            // Supprimer du storage si elle existe
            if (photoRecord?.file_path) {
                await supabase.storage
                    .from('images')
                    .remove([photoRecord.file_path]);
            }

            // Supprimer de la table photos
            if (photoRecord?.id) {
                const { error: deleteError } = await supabase
                    .from('photos')
                    .delete()
                    .eq('id', photoRecord.id);

                if (deleteError) throw deleteError;
            }

            console.log(`✅ Photo supprimée pour ${entityType} #${entityId}`);

            res.json({
                success: true,
                message: 'Photo supprimée avec succès'
            });
        } catch (error) {
            console.error(`❌ Erreur suppression ${entityType}:`, error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression de la photo'
            });
        }
    };
};

// ===================================
// EXPORTS
// ===================================

module.exports = {
    // Enfants scolaires
    uploadPhotoEnfant: createUploadMiddleware('enfant'),
    deletePhotoEnfant: createDeleteMiddleware('enfant'),

    // Animateurs scolaires
    uploadPhotoAnimateur: createUploadMiddleware('animateur'),
    deletePhotoAnimateur: createDeleteMiddleware('animateur'),

    // Directeurs scolaires
    uploadPhotoDirecteur: createUploadMiddleware('directeur'),
    deletePhotoDirecteur: createDeleteMiddleware('directeur'),

    // Aumoniers scolaires
    uploadPhotoAumonier: createUploadMiddleware('aumonier'),
    deletePhotoAumonier: createDeleteMiddleware('aumonier'),

    // Enfants vacances
    uploadPhotoVacanceEnfant: createUploadMiddleware('vacance_enfant'),
    deletePhotoVacanceEnfant: createDeleteMiddleware('vacance_enfant'),

    // Animateurs vacances
    uploadPhotoVacanceAnimateur: createUploadMiddleware('vacance_animateur'),
    deletePhotoVacanceAnimateur: createDeleteMiddleware('vacance_animateur'),

    // Directeurs vacances
    uploadPhotoVacanceDirecteur: createUploadMiddleware('vacance_directeur'),
    deletePhotoVacanceDirecteur: createDeleteMiddleware('vacance_directeur'),

    // Aumoniers vacances
    uploadPhotoVacanceAumonier: createUploadMiddleware('vacance_aumonier'),
    deletePhotoVacanceAumonier: createDeleteMiddleware('vacance_aumonier')
};