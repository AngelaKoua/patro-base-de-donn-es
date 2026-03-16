const pool = require('../config/database');

module.exports = async (req, res) => {
  const { id } = req.params;
  const { annee, evenement, date_debut, date_fin, cible } = req.body;
  try {
    await pool.query(
      `UPDATE evenement_vacance SET annee=?, evenement=?, date_debut=?, date_fin=?, cible=? WHERE id=?`,
      [annee, evenement, date_debut, date_fin, cible, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};