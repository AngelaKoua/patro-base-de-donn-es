const supabase = require('../config/supabase');

const addDetailsVacanceDirecteur = async (req, res) => {
    try {
        const { directeur_id } = req.params;
        const {
            email,
            whatsapp,
            autre_contact,
            realisation
        } = req.body;

        console.log('Ajout des détails pour le directeur de vacances:', directeur_id);

        // Vérifier si des détails existent déjà
        const { data: existingDetails } = await supabase
            .from('detail_directeur_vacance')
            .select('*')
            .eq('directeur_id', directeur_id)
            .single();

        let result;
        if (existingDetails) {
            // Mettre à jour les détails existants
            result = await supabase
                .from('detail_directeur_vacance')
                .update({
                    email,
                    whatsapp,
                    autre_contact,
                    realisation
                })
                .eq('directeur_id', directeur_id)
                .select()
                .single();
        } else {
            // Insérer de nouveaux détails
            result = await supabase
                .from('detail_directeur_vacance')
                .insert([{
                    directeur_id,
                    email,
                    whatsapp,
                    autre_contact,
                    realisation
                }])
                .select()
                .single();
        }

        if (result.error) {
            console.error('Erreur Supabase:', result.error);
            throw result.error;
        }

        res.json({
            success: true,
            message: "Détails du directeur ajoutés/mis à jour avec succès",
            details: result.data
        });
    } catch (err) {
        console.error('Erreur lors de l\'ajout des détails du directeur:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout des détails du directeur',
            error: err.message
        });
    }
};

module.exports = addDetailsVacanceDirecteur;