
const supabase = require('../config/supabase');

const updateVacanceAumonier = async (req, res) => {
    try {
        const { id } = req.params;
        const { annee, nom, prenom, fonction, naissance } = req.body;
        console.log('Modification de l\'aumônier:', { id, annee, nom, prenom, fonction, naissance });

        // Validation des données requises
        if (!id || !nom || !prenom || !fonction || !annee || !naissance) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs sont requis"
            });
        }

        // Vérifier que l'année est un nombre valide
        if (isNaN(annee) || annee < 1900 || annee > 2100) {
            return res.status(400).json({
                success: false,
                message: "L'année doit être un nombre valide entre 1900 et 2100"
            });
        }

        // Vérifier que la date de naissance est valide
        const dateNaissance = new Date(naissance);
        if (isNaN(dateNaissance.getTime())) {
            return res.status(400).json({
                success: false,
                message: "La date de naissance n'est pas valide"
            });
        }

        // Vérifier si l'aumônier existe
        const { data: existingAumonier, error: checkError } = await supabase
            .from('vacance_aumonier')
            .select('id')
            .eq('id', id)
            .single();

        if (checkError || !existingAumonier) {
            return res.status(404).json({
                success: false,
                message: "Aumônier non trouvé"
            });
        }

        // Mettre à jour l'aumônier
        const { data, error } = await supabase
            .from('vacance_aumonier')
            .update({
                annee,
                nom,
                prenom,
                fonction,
                naissance
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Erreur Supabase:', error);
            throw error;
        }

        res.json({
            success: true,
            message: "Aumônier modifié avec succès",
            aumonier: data
        });
    } catch (err) {
        console.error('Erreur lors de la modification de l\'aumônier:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la modification de l\'aumônier',
            error: err.message || err
        });
    }
};

module.exports = updateVacanceAumonier;