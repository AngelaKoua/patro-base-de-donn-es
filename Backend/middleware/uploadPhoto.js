// middleware/uploadPhoto.js (pour enfants scolaires)
const multer = require('multer');
const { handlePhotoUpload } = require('../utils/photoUploadHelper');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seules les images sont autorisées'));
    }
    cb(null, true);
  }
}).single('photo');

const uploadPhoto = async (req, res) => {
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

    const enfantId = parseInt(req.body.enfant_id);
    if (isNaN(enfantId)) {
      return res.status(400).json({
        success: false,
        message: 'ID enfant invalide'
      });
    }

    try {
      const result = await handlePhotoUpload({
        fileBuffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname,
        entityId: enfantId,
        entityType: 'enfant',
        tableName: 'patronier_scolaire'
      });

      res.json({
        success: true,
        message: 'Photo téléchargée avec succès',
        ...result
      });
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la sauvegarde de la photo'
      });
    }
  });
};

module.exports = uploadPhoto;