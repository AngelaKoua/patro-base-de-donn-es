const db = require('../config/database');
const upload = require('../config/multer');

module.exports = [
  upload.single('photo'),
  async (req, res) => {
    console.log('--- uploadPhotoVacanceAnimateur ---');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const animateur_id = req.body?.animateur_id;
    const photo_base64 = req.file ? req.file.buffer.toString('base64') : req.body?.photo_base64;

    if (!animateur_id || !photo_base64) {
      console.warn('Champs requis manquants pour uploadPhotoVacanceAnimateur');
      return res.status(400).json({ success: false, error: "Champs requis manquants." });
    }

    try {
      const [rows] = await db.query(
        "SELECT id FROM photo_vacance_animateur WHERE animateur_id = ?",
        [animateur_id]
      );
      if (rows.length > 0) {
        await db.query(
          "UPDATE photo_vacance_animateur SET photo_base64 = ? WHERE animateur_id = ?",
          [photo_base64, animateur_id]
        );
        console.log('Photo mise à jour pour animateur_id:', animateur_id);
        res.json({ success: true, message: "Photo mise à jour", photo_base64 });
      } else {
        await db.query(
          "INSERT INTO photo_vacance_animateur (animateur_id, photo_base64) VALUES (?, ?)",
          [animateur_id, photo_base64]
        );
        console.log('Photo ajoutée pour animateur_id:', animateur_id);
        res.json({ success: true, message: "Photo ajoutée", photo_base64 });
      }
    } catch (err) {
      console.error('Erreur SQL uploadPhotoVacanceAnimateur:', err);
      res.status(500).json({ success: false, error: err });
    }
  }
];