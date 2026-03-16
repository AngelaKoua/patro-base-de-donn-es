const pool = require('../config/database');
const upload = require('../config/multer');

// On exporte un tableau de middlewares pour Express
const uploadPhotoAumonier = [
  upload.single('photo'),
  async (req, res) => {
    try {
      const { aumonier_id } = req.body;
      if (!aumonier_id || !req.file) {
        return res.status(400).json({ success: false, message: "ID ou fichier manquant" });
      }
      const photoBuffer = req.file.buffer;
      const photoBase64 = photoBuffer.toString('base64');

      // Vérifie si une photo existe déjà pour cet aumonier
      const [results] = await pool.query(
        'SELECT id FROM photo_aumonier_scolaire WHERE aumonier_id = ?',
        [aumonier_id]
      );

      if (results.length > 0) {
        // Update
        await pool.query(
          'UPDATE photo_aumonier_scolaire SET photo = ?, photo_base64 = ? WHERE aumonier_id = ?',
          [photoBuffer, photoBase64, aumonier_id]
        );
        return res.json({ success: true, photo_base64: `data:image/jpeg;base64,${photoBase64}` });
      } else {
        // Insert
        await pool.query(
          'INSERT INTO photo_aumonier_scolaire (aumonier_id, photo, photo_base64) VALUES (?, ?, ?)',
          [aumonier_id, photoBuffer, photoBase64]
        );
        return res.json({ success: true, photo_base64: `data:image/jpeg;base64,${photoBase64}` });
      }
    } catch (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ success: false, message: 'Erreur SQL', error: err.message });
    }
  }
];

module.exports = uploadPhotoAumonier;