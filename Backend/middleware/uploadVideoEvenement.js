// middleware/uploadVideoEvenement.js
const multer = require('multer');
const supabase = require('../config/supabase');

// Configuration Multer pour vidéo (même pattern que les photos)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB (pour ~3 min de vidéo)
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Seules les vidéos sont autorisées'));
    }
    cb(null, true);
  }
}).single('video');

const uploadVideoEvenement = async (req, res) => {
  upload(req, res, async (err) => {
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

    // Récupérer l'ID depuis le body
    const evenementId = parseInt(req.body.evenementId || req.body.evenement_id);

    if (isNaN(evenementId)) {
      return res.status(400).json({
        success: false,
        message: 'ID événement invalide'
      });
    }

    try {
      console.log(`📹 Upload vidéo pour événement #${evenementId}`);

      // Générer le nom de fichier
      const timestamp = Date.now();
      const fileName = `video-${evenementId}-${timestamp}.${req.file.originalname.split('.').pop()}`;
      const filePath = `videos/${evenementId}/${fileName}`;

      console.log(`📤 Upload vers Supabase Storage: ${filePath}`);

      // Upload vers Supabase Storage (même pattern que les photos)
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

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from('evenements-videos')
        .getPublicUrl(filePath);

      const videoUrl = urlData.publicUrl;
      console.log('🔗 URL publique:', videoUrl);

      // Mettre à jour la table detail_evenement_scolaire
      const { error: updateError } = await supabase
        .from('detail_evenement_scolaire')
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

      console.log(`✅ Vidéo sauvegardée pour événement #${evenementId}`);

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

module.exports = uploadVideoEvenement;