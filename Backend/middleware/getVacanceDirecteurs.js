
const supabase = require('../config/supabase');

module.exports = async (req, res) => {
    try {
        console.log('Récupération des directeurs de vacances...');
        // Récupérer d'abord tous les directeurs
        const { data: directeurs, error: directeursError } = await supabase
            .from('vacance_directeur')
            .select('*');

        if (directeursError) {
            console.error('Erreur Supabase (directeurs):', directeursError);
            throw directeursError;
        }

        // Ensuite récupérer tous les détails
        const { data: allDetails, error: detailsError } = await supabase
            .from('detail_directeur_vacance')
            .select('*');

        if (detailsError) {
            console.error('Erreur Supabase (détails):', detailsError);
            throw detailsError;
        }

        // Créer un map des détails par directeur_id pour un accès facile
        const detailsMap = Object.fromEntries(
            allDetails?.map(detail => [detail.directeur_id, detail]) || []
        );

        const directeursAvecDetails = directeurs.map(directeur => ({
            ...directeur,
            details: detailsMap[directeur.id] || null
        }));

        console.log(`${directeursAvecDetails.length} directeurs trouvés`);
        res.json({ success: true, directeurs: directeursAvecDetails });
    } catch (err) {
        console.error('Erreur lors de la récupération des directeurs:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération des directeurs',
            error: err.message || err 
        });
    }
};