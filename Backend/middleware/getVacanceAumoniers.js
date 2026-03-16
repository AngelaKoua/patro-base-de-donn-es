
const supabase = require('../config/supabase');

const getVacanceAumoniers = async (req, res) => {
    try {
        // Récupérer la liste des aumôniers
        const { data: aumoniers, error } = await supabase
            .from('vacance_aumonier')
            .select('*')
            .order('annee', { ascending: false });

        if (error) {
            console.error('Erreur Supabase:', error);
            throw error;
        }

        // Ajouter les détails pour chaque aumônier
        const aumonierPromises = aumoniers.map(async (aumonier) => {
            const { data: details, error: detailsError } = await supabase
                .from('detail_aumonier_vacance')
                .select('*')
                .eq('aumonier_id', aumonier.id)
                .single();

            if (detailsError && detailsError.code !== 'PGRST116') { // Ignore l'erreur "not found"
                console.error('Erreur lors de la récupération des détails:', detailsError);
            }

            return {
                ...aumonier,
                ...(details || {}) // Fusionner les détails s'ils existent
            };
        });

        const aumonierAvecDetails = await Promise.all(aumonierPromises);

        res.json({
            success: true,
            aumoniers: aumonierAvecDetails
        });
    } catch (err) {
        console.error('Erreur lors de la récupération des aumôniers:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des aumôniers',
            error: err.message || err
        });
    }
};

module.exports = getVacanceAumoniers;