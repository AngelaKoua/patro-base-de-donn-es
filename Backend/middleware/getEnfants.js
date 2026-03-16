const supabase = require('../config/supabase');

const getEnfants = async (req, res) => {
    try {
        const { data: enfants, error } = await supabase
            .from('patronier_scolaire')
            .select('*')
            .order('annee', { ascending: false })
            .order('nom', { ascending: true });

        if (error) throw error;

        res.json({ success: true, enfants });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la récupération des enfants"
        });
    }
};

module.exports = getEnfants;