const pool = require('../config/database');

const deleteEnfantVacance = async (req, res) => {
  try {
    await pool.query('DELETE FROM enfants_vacance WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur SQL' });
  }
};

module.exports = deleteEnfantVacance;