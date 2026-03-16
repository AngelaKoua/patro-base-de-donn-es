
const pool = require('../config/database');
const upload = require('../config/multer');

const uploadPhotoVacanceEnfant = [
  upload.single('photo'),
  async (req, res) => {
    try {
      const { enfant_id } = req.body;
      if (!enfant_id || !req.file) {
        return res.status(400).json({ success: false, message: "ID ou fichier manquant" });
      }
      const photoBuffer = req.file.buffer;
      const photoBase64 = photoBuffer.toString('base64');
      const [results] = await pool.query(
        'SELECT id FROM photos_vacance_enfant WHERE enfant_id = ?',
        [enfant_id]
      );
      if (results.length > 0) {
        await pool.query(
          'UPDATE photos_vacance_enfant SET photo_base64 = ? WHERE enfant_id = ?',
          [photoBase64, enfant_id]
        );
      } else {
        await pool.query(
          'INSERT INTO photos_vacance_enfant (enfant_id, photo_base64) VALUES (?, ?)',
          [enfant_id, photoBase64]
        );
      }
      return res.json({ success: true, photoUrl: `data:image/jpeg;base64,${photoBase64}` });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Erreur SQL', error: err.message });
    }
  }
];

module.exports = uploadPhotoVacanceEnfant;