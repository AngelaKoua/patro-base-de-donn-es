const db = require('../config/database');
const upload = require('../config/multer');

const uploadPhotoDirecteur = async (req, res) => {
  upload.single('photo')(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: "Erreur lors de l'upload" });
    }
    const directeur_id = req.body.directeur_id;
    if (!req.file || !directeur_id) {
      return res.status(400).json({ success: false, message: "Fichier ou ID manquant" });
    }
    const photo_base64 = req.file.buffer.toString('base64');

    try {
      const [results] = await db.query('SELECT id FROM photo_directeur_scolaire WHERE directeur_id = ?', [directeur_id]);
      if (results.length > 0) {
        await db.query('UPDATE photo_directeur_scolaire SET photo_base64 = ? WHERE directeur_id = ?', [photo_base64, directeur_id]);
        res.json({ success: true, photo_base64: photo_base64 });
      } else {
        await db.query('INSERT INTO photo_directeur_scolaire (directeur_id, photo_base64) VALUES (?, ?)', [directeur_id, photo_base64]);
        res.json({ success: true, photo_base64: photo_base64 });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Erreur SQL" });
    }
  });
};

module.exports = uploadPhotoDirecteur;