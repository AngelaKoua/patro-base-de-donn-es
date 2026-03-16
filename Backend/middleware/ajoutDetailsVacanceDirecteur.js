

const supabase = require('../config/supabase');

const ajoutDetailsVacanceDirecteur = async (req, res) => {
    try {
        const { directeur_id } = req.params;
        const { realisation, email, whatsapp, autre_contact } = req.body;
        console.log('Ajout/Mise à jour des détails du directeur:', { directeur_id, body: req.body });

        // Validation des données requises
        if (!directeur_id) {
            return res.status(400).json({
                success: false,
                message: "L'ID du directeur est requis"
            });
        }

        // Vérifier qu'au moins un champ est fourni
        if (!realisation && !email && !whatsapp && !autre_contact) {
            return res.status(400).json({
                success: false,
                message: "Au moins un champ doit être fourni (realisation, email, whatsapp ou autre_contact)"
            });
        }

        // Vérifier si le directeur existe
        const { data: directeur, error: directeurError } = await supabase
            .from('vacance_directeur')
            .select()
            .eq('id', directeur_id)
            .single();

        if (directeurError || !directeur) {
            return res.status(404).json({
                success: false,
                message: "Le directeur spécifié n'existe pas"
            });
        }

        // Vérifier si les détails existent déjà
        const { data: existingDetails, error: existingError } = await supabase
            .from('detail_directeur_vacance')
            .select()
            .eq('directeur_id', directeur_id);

        if (existingError) {
            console.error('Erreur lors de la vérification des détails existants:', existingError);
            throw existingError;
        }

        let result;
        if (existingDetails && existingDetails.length > 0) {
            // Mise à jour
            const updateData = {};
            if (realisation !== undefined) updateData.realisation = realisation;
            if (email !== undefined) updateData.email = email;
            if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
            if (autre_contact !== undefined) updateData.autre_contact = autre_contact;

            const { data, error } = await supabase
                .from('detail_directeur_vacance')
                .update(updateData)
                .eq('directeur_id', directeur_id)
                .select();

            if (error) {
                console.error('Erreur lors de la mise à jour:', error);
                throw error;
            }
            if (!data || data.length === 0) {
                throw new Error('Aucune donnée retournée après la mise à jour');
            }
            result = { success: true, message: "Détails mis à jour", data: data[0] };
        } else {
            // Insertion
            const insertData = {
                directeur_id,
                realisation: realisation || null,
                email: email || null,
                whatsapp: whatsapp || null,
                autre_contact: autre_contact || null
            };

            console.log('Données à insérer:', insertData);

            const { data, error } = await supabase
                .from('detail_directeur_vacance')
                .insert([insertData])
                .select();

            if (error) {
                console.error('Erreur Supabase lors de l\'insertion:', error);
                throw error;
            }
            if (!data || data.length === 0) {
                throw new Error('Aucune donnée retournée après l\'insertion');
            }
            result = { success: true, message: "Détails ajoutés", data: data[0] };
        }

        res.json(result);
    } catch (err) {
        console.error('Erreur lors de l\'ajout/mise à jour des détails du directeur:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout/mise à jour des détails du directeur',
            error: err.message || err
        });
    }
};

module.exports = ajoutDetailsVacanceDirecteur;