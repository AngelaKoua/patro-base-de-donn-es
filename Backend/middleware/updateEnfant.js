const supabase = require('../config/supabase');

const updateEnfant = async (req, res) => {
    try {
        const { id } = req.params;
        const { numero_inscription, annee, nom, prenom, naissance, section, sexe, classe, religion } = req.body;
        
        const { data: enfant, error } = await supabase
            .from('patronier_scolaire')
            .update({
                numero_inscription,
                annee,
                nom,
                prenom,
                naissance,
                section,
                sexe,
                religion,
                classe
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        if (!enfant) {
            return res.status(404).json({
                success: false,
                message: "Enfant non trouvé"
            });
        }

        res.status(200).json({
            success: true,
            message: "Enfant mis à jour avec succès",
            enfant
        });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour de l'enfant",
            error: error.message
        });
    }
};

module.exports = updateEnfant;