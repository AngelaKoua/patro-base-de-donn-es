const multer = require('multer');
const supabase = require('../config/supabase');

// Configuration de multer pour stocker en mémoire
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seules les images sont autorisées'));
    }
    cb(null, true);
  }
});

const uploadPhoto = (req, res) => {
  upload.single('photo')(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du téléchargement de la photo: ' + err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune photo fournie'
      });
    }

    const enfantId = parseInt(req.body.enfant_id);
    if (isNaN(enfantId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID enfant invalide' 
      });
    }
    
    console.log('Tentative d\'upload de photo:', {
      enfant_id: enfantId,
      file_size: req.file.size,
      mime_type: req.file.mimetype
    });

    try {
      // Vérifier si l'enfant existe
      const { data: enfant, error: enfantError } = await supabase
        .from('patronier_scolaire')
        .select('id, nom, prenom')
        .eq('id', enfantId)
        .single();

      if (enfantError || !enfant) {
        console.log('Erreur ou enfant non trouvé:', { error: enfantError });
        return res.status(404).json({
          success: false,
          message: 'Enfant non trouvé'
        });
      }

      console.log('Enfant trouvé:', { id: enfant.id, nom: enfant.nom });

      // Insérer la photo
      console.log('Tentative d\'insertion de la photo...');
      const { data: insertedPhoto, error: insertError } = await supabase
        .from('photos')
        .insert([{
          enfant_id: enfantId,
          photo_data: req.file.buffer,
          mime_type: req.file.mimetype
        }])
        .select('id, mime_type')
        .single();

      if (insertError) {
        console.error('Erreur lors de l\'insertion:', insertError);
        throw insertError;
      }

      console.log('Photo insérée avec succès:', insertedPhoto);

      // Générer la dataURL pour la prévisualisation
      const base64Data = req.file.buffer.toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64Data}`;

      res.json({
        success: true,
        message: 'Photo téléchargée avec succès',
        photo: insertedPhoto,
        dataUrl: dataUrl
      });

    } catch (error) {
      console.error('Erreur lors du traitement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la sauvegarde de la photo',
        error: error.message
      });
    }
  });
};

module.exports = uploadPhoto;