const multer = require('multer');
const supabase = require('../config/supabase');

// Configuration de multer pour stocker en mémoire
const storage = multer.memoryStorage();

// Configuration de multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    console.log('Multer fileFilter:', {
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seules les images sont autorisées'));
    }
    cb(null, true);
  }
}).single('photo');

const testPhotosUpload = async (req, res) => {
  console.log('=== Test Photos Upload - Start ===');
  
  upload(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
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

    console.log('File info:', {
      mimetype: req.file.mimetype,
      size: req.file.size,
      originalname: req.file.originalname
    });

    console.log('Request body:', req.body);

    try {
      // Récupérer enfant_id (peut être null)
      const enfantId = req.body.enfant_id ? parseInt(req.body.enfant_id) : null;
      
      console.log('Enfant ID:', enfantId);

      // Si enfant_id est fourni, vérifier qu'il existe
      if (enfantId !== null) {
        const { data: enfant, error: enfantError } = await supabase
          .from('patronier_scolaire')
          .select('id')
          .eq('id', enfantId)
          .maybeSingle();

        if (!enfant) {
          return res.status(404).json({
            success: false,
            message: `Enfant avec ID ${enfantId} non trouvé`
          });
        }

        console.log('Enfant trouvé:', enfant);
      } else {
        console.log('Aucun enfant_id fourni, photo sans lien à un enfant');
      }

      // Générer un nom de fichier unique
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `photo_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const filePath = `photos/${fileName}`;

      console.log('Nom du fichier généré:', filePath);

      // Upload du fichier dans le bucket Storage
      console.log('Upload vers Supabase Storage...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.error('Erreur Storage upload:', uploadError);
        throw uploadError;
      }

      console.log('Upload Storage réussi:', uploadData);

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('URL publique générée:', publicUrl);

      // Sauvegarder dans la table photos
      console.log('Sauvegarde dans la table photos...');
      const photoData = {
        enfant_id: enfantId,
        file_path: filePath,
        public_url: publicUrl,
        mime_type: req.file.mimetype
      };

      console.log('Données à insérer:', photoData);

      const { data: insertData, error: dbError } = await supabase
        .from('photos')
        .insert([photoData])
        .select('*');

      if (dbError) {
        console.error('Erreur base de données:', dbError);
        // Si erreur DB, supprimer le fichier uploadé
        await supabase.storage.from('images').remove([filePath]);
        throw dbError;
      }

      console.log('Photo sauvegardée avec succès:', insertData);

      res.json({
        success: true,
        message: 'Photo uploadée avec succès',
        photo: insertData[0],
        debug: {
          filePath: filePath,
          publicUrl: publicUrl,
          enfantId: enfantId,
          mimeType: req.file.mimetype,
          size: req.file.size
        }
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la photo:', error);
      
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la sauvegarde de la photo',
        error: error.message
      });
    }
  });
};

module.exports = testPhotosUpload;
