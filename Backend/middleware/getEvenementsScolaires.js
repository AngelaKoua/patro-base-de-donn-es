const supabase = require('../config/supabase');

module.exports = async (req, res) => {
    try {
        const { annee, evenement, date_debut, date_fin, cible } = req.query;
        
        // Commencer la requête avec Supabase
        let query = supabase
            .from('scolaire_evenement')
            .select('*');

        // Ajouter les filtres si présents
        if (annee) {
            query = query.eq('annee', parseInt(annee));
        }
        if (evenement) {
            query = query.ilike('evenement', `%${evenement}%`);
        }
        if (date_debut) {
            query = query.gte('date_debut', date_debut);
        }
        if (date_fin) {
            query = query.lte('date_fin', date_fin);
        }
        if (cible) {
            query = query.ilike('cible', `%${cible}%`);
        }

        // Ajouter l'ordre
        query = query.order('date_debut', { ascending: false });

        console.log('Executing Supabase query...');
        
        const { data, error } = await query;

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log(`Found ${data.length} events`);

        res.json({
            success: true,
            evenements: data
        });
    } catch (err) {
        console.error('Error in getEvenementsScolaires:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des événements',
            error: err.message
        });
    }
};