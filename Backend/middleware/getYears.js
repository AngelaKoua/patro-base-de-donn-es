const pool = require('../config/database');

const getYears = async (req, res) => {
  try {
    const sql = 'SELECT DISTINCT annee FROM patronier_scolaire ORDER BY annee DESC';
    const [result] = await pool.query(sql);
    const years = result.map(row => row.annee.toString());
    res.json({
      success: true,
      annees: years
    });
  } catch (err) {
    console.error('Error fetching years:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des années'
    });
  }
};

module.exports = getYears;