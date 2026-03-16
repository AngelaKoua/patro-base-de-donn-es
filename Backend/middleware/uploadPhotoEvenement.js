const upload = require('../config/multer');
const fs = require('fs');

// POST /api/upload-photo-evenement
module.exports = function(req, res) {
  upload.single('photo')(req, res, function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erreur lors de l\'upload', error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier reçu' });
    }
    // Génère l'URL d'accès à la photo
    const photoUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, photoUrl });
  });
};
