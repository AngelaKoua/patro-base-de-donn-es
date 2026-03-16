const supabase = require('../config/supabase');

module.exports = async (req, res) => {
    const { annee, evenement, date_debut, date_fin, cible } = req.body;
    
    // Validation des champs
    if (!annee || !evenement || !date_debut || !date_fin || !cible) {
        return res.status(400).json({
            success: false,
            message: "Tous les champs sont obligatoires."
        });
    }

    try {
        // Insertion avec Supabase
        const { data, error } = await supabase
            .from('scolaire_evenement')
            .insert([
                {
                    annee: parseInt(annee),
                    evenement,
                    date_debut,
                    date_fin,
                    cible
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Erreur Supabase:', error);
            throw error;
        }

        console.log('Événement ajouté avec succès:', data);

        res.status(201).json({
            success: true,
            evenement: data
        });
    } catch (err) {
        console.error('Erreur lors de l\'ajout:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout de l\'événement',
            error: err.message
        });
    }
};