


const db = require('../config/database');
const upload = require('../config/multer');

module.exports = [
  upload.single('photo'),
  async (req, res) => {
    try {
      const aumonier_id = req.body?.aumonier_id;
      const photo_base64 = req.file ? req.file.buffer.toString('base64') : req.body?.photo_base64;

      if (!aumonier_id || !photo_base64) {
        return res.status(400).json({ success: false, error: "Champs requis manquants." });
      }

      const [rows] = await db.query(
        "SELECT id FROM photo_vacance_aumonier WHERE aumonier_id = ?",
        [aumonier_id]
      );
      if (rows.length > 0) {
        await db.query(
          "UPDATE photo_vacance_aumonier SET photo_base64 = ? WHERE aumonier_id = ?",
          [photo_base64, aumonier_id]
        );
        res.json({ success: true, message: "Photo mise à jour", photo_base64 });
      } else {
        await db.query(
          "INSERT INTO photo_vacance_aumonier (aumonier_id, photo_base64) VALUES (?, ?)",
          [aumonier_id, photo_base64]
        );
        res.json({ success: true, message: "Photo ajoutée", photo_base64 });
      }
    } catch (err) {
      res.status(500).json({ success: false, error: err.message || err });
    }
  }
];