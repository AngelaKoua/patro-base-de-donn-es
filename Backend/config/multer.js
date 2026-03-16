const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtre pour les fichiers
const fileFilter = (req, file, cb) => {
  // Accepter uniquement les images et vidéos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non supporté. Utilisez des images ou des vidéos.'), false);
  }
};

// Configuration Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite à 10MB
  }
});

module.exports = upload;