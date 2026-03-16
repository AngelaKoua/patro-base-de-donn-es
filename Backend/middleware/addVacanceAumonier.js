
const supabase = require('../config/supabase');

const addVacanceAumonier = async (req, res) => {
    try {
        const { annee, nom, prenom, fonction, naissance } = req.body;
        console.log('Ajout d\'un nouvel aumônier:', { annee, nom, prenom, fonction, naissance });

        // Validation des données requises
        if (!nom || !prenom || !fonction || !annee || !naissance) {
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

        const { data, error } = await supabase
            .from('vacance_aumonier')
            .insert([{
                annee,
                nom,
                prenom,
                fonction,
                naissance
            }])
            .select()
            .single();

        if (error) {
            console.error('Erreur Supabase:', error);
            throw error;
        }

        res.json({
            success: true,
            message: "Aumônier ajouté avec succès",
            aumonierId: data.id
        });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de l\'aumônier:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout de l\'aumônier',
            error: err.message || err
        });
    }
};

module.exports = addVacanceAumonier;