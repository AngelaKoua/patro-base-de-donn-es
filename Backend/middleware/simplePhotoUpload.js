const multer = require('multer');
const supabase = require('../config/supabase');

// Configuration de multer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    console.log('Upload file:', file.originalname, file.mimetype);
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seules les images sont autorisées'));
    }
    cb(null, true);
  }
}).single('photo');

const simplePhotoUpload = async (req, res) => {
  console.log('=== Simple Photo Upload ===');
  
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune photo fournie'
      });
    }

    try {
      const titre = req.body.titre || 'Sans titre';
      const description = req.body.description || '';

      console.log('Données reçues:', {
        titre,
        description,
        file: req.file.originalname,
        size: req.file.size
      });

      // Générer un nom unique
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const ext = req.file.originalname.split('.').pop();
      const fileName = `photo_${timestamp}_${randomStr}.${ext}`;
      const filePath = `test-photos/${fileName}`;

      console.log('Upload vers:', filePath);

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.error('Storage error:', uploadError);
        throw uploadError;
      }

      console.log('Upload réussi:', uploadData);

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('URL publique:', publicUrl);

      // Sauvegarder dans la table test_photos
      const { data: photoData, error: dbError } = await supabase
        .from('test_photos')
        .insert([{
          titre,
          description,
          file_path: filePath,
          public_url: publicUrl,
          mime_type: req.file.mimetype,
          file_size: req.file.size
        }])
        .select('*');

      if (dbError) {
        console.error('Database error:', dbError);
        // Supprimer le fichier si erreur DB
        await supabase.storage.from('images').remove([filePath]);
        throw dbError;
      }

      console.log('Photo sauvegardée:', photoData[0]);

      res.json({
        success: true,
        message: 'Photo uploadée avec succès',
        photo: photoData[0]
      });

    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'upload',
        error: error.message
      });
    }
  });
};

module.exports = simplePhotoUpload;
