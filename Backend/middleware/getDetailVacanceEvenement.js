const pool = require('../config/database');

module.exports = async (req, res) => {
  const { id } = req.params;
  try {
  const [rows] = await pool.query('SELECT * FROM detail_evenement_vacance WHERE evenement_id = ?', [id]);
    if (rows.length > 0) {
      res.json({ success: true, detail: rows[0] });
    } else {
      res.json({ success: true, detail: null });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};