const pool = require('../config/database');

const getStats = async (req, res) => {
  const year = req.params.year;
  if (!year) {
    return res.status(400).json({
      success: false,
      message: 'Année non spécifiée'
    });
  }
  const yearNum = parseInt(year);
  if (isNaN(yearNum)) {
    return res.status(400).json({
      success: false,
      message: "Format d'année invalide"
    });
  }
  try {
    const sql = `
      SELECT 
        COUNT(CASE WHEN sexe = 'F' THEN 1 END) as totalFilles,
        COUNT(CASE WHEN sexe = 'M' THEN 1 END) as totalGarcons,
        COUNT(*) as totalGeneral
      FROM patronier_scolaire
      WHERE annee = ?
    `;
    const [result] = await pool.query(sql, [yearNum]);
    if (!result.length) {
      return res.json({
        success: true,
        stats: {
          totalFilles: 0,
          totalGarcons: 0,
          totalGeneral: 0
        }
      });
    }
    res.json({
      success: true,
      stats: {
        totalFilles: result[0].totalFilles || 0,
        totalGarcons: result[0].totalGarcons || 0,
        totalGeneral: result[0].totalGeneral || 0
      }
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

module.exports = getStats;