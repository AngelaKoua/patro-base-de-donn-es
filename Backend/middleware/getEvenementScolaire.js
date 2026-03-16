const pool = require('../config/database');

module.exports = async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    console.log('ID demandé :', id);
    try {
        const [rows] = await pool.query('SELECT * FROM scolaire_evenement WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: "Non trouvé" });
        console.log(rows[0]);
        res.json({ success: true, evenement: rows[0] });
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
};