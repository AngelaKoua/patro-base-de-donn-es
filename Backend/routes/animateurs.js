const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadPhotoAnimateur = require('../middleware/uploadPhotoAnimateur');
const ajoutVacanceAnimateur = require('../middleware/ajoutVacanceAnimateur');
const getVacanceAnimateur = require('../middleware/getVacanceAnimateur');
const getVacanceAnimateurs = require('../middleware/getVacanceAnimateurs');
const updateVacanceAnimateur = require('../middleware/updateVacanceAnimateur');
const deleteVacanceAnimateur = require('../middleware/deleteVacanceAnimateur');
const ajoutDetailsVacanceAnimateur = require('../middleware/ajoutDetailsVacanceAnimateur');

// Configuration de Multer pour l'upload de photos
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // limite à 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Le fichier doit être une image'));
    }
  }
});

// Routes pour les animateurs de vacances
router.get('/', getVacanceAnimateurs);
router.get('/:id', getVacanceAnimateur);
router.post('/', ajoutVacanceAnimateur);
router.put('/:id', updateVacanceAnimateur);
router.delete('/:id', deleteVacanceAnimateur);

// Route pour l'upload de photo
router.post('/photo/upload', upload.single('photo'), uploadPhotoAnimateur);

// Routes pour les détails des animateurs de vacances
router.post('/details', ajoutDetailsVacanceAnimateur);
router.put('/details/:animateur_id', ajoutDetailsVacanceAnimateur);

module.exports = router;