const supabase = require('../config/supabase');

const ajoutEnfantScolaire = async (req, res) => {
    try {
        const { numero_inscription, annee, nom, prenom, naissance, section, sexe, religion, classe } = req.body;

        // Validation des champs requis
        if (!numero_inscription || !annee || !nom || !prenom || !naissance || !section || !sexe || !religion || !classe) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs sont requis"
            });
        }

        const { data, error } = await supabase
            .from('patronier_scolaire')
            .insert([{
                numero_inscription,
                annee,
                nom,
                prenom,
                naissance,
                section,
                sexe,
                religion,
                classe
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            enfant: data,
            message: "Enfant ajouté avec succès"
        });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de l'ajout de l'enfant"
        });
    }
};

module.exports = ajoutEnfantScolaire;