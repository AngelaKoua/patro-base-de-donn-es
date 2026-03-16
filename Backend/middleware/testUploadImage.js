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
}).single('image');

const testUploadImage = async (req, res) => {
  console.log('Test Upload Image - Start');
  
  upload(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du téléchargement de l\'image: ' + err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie'
      });
    }

    console.log('File info:', {
      mimetype: req.file.mimetype,
      size: req.file.size,
      originalname: req.file.originalname
    });

    try {
      // Générer un nom de fichier unique
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `test_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const filePath = `test-images/${fileName}`;

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

      // Sauvegarder les métadonnées dans la table test_images
      console.log('Sauvegarde des métadonnées dans la base de données...');
      const { data: insertData, error: dbError } = await supabase
        .from('test_images')
        .insert([{
          file_path: filePath,
          public_url: publicUrl,
          mime_type: req.file.mimetype,
          file_size: req.file.size,
          original_name: req.file.originalname
        }])
        .select('*');

      if (dbError) {
        console.error('Erreur base de données:', dbError);
        // Si erreur DB, supprimer le fichier uploadé
        await supabase.storage.from('images').remove([filePath]);
        throw dbError;
      }

      console.log('Image sauvegardée avec succès:', insertData);

      res.json({
        success: true,
        message: 'Image uploadée avec succès',
        data: insertData[0],
        debug: {
          filePath: filePath,
          publicUrl: publicUrl,
          mimeType: req.file.mimetype,
          size: req.file.size
        }
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'image:', error);
      
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la sauvegarde de l\'image',
        error: error.message
      });
    }
  });
};

module.exports = testUploadImage;
