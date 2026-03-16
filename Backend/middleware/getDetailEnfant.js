const db = require('../config/database');

const getDetailEnfant = (req, res) => {
  const id = req.params.id;
  
  const sql = `
    SELECT p.*, d.*
    FROM patronier_scolaire p
    LEFT JOIN details_enfants_scolaire d ON p.id = d.enfant_id
    WHERE p.id = ?
  `;
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération:', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patronnier non trouvé'
      });
    }

    if (result[0] && result[0].photo_data) {
      result[0].photo_base64 = `data:${result[0].mime_type};base64,${result[0].photo_data.toString('base64')}`;
    }
    res.json({
      success: true,
      enfant: result[0]
    });
  });
};

module.exports = getDetailEnfant;