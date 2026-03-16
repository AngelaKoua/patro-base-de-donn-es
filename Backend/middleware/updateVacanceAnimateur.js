const supabase = require('../config/supabase');

const updateVacanceAnimateur = async (req, res) => {
    try {
        const animateurId = req.params.id;
        const { annee, nom, prenom, fonction, naissance, sexe, section, religion } = req.body;

        // Validation des champs requis
        if (!annee || !nom || !prenom || !fonction || !naissance || !sexe || !section || !religion) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs sont obligatoires"
            });
        }

        // Validation du format de la date
        const dateNaissance = new Date(naissance);
        if (isNaN(dateNaissance.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Le format de la date de naissance est invalide"
            });
        }

        // Validation du sexe
        if (!['M', 'F'].includes(sexe.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Le sexe doit être "M" ou "F"'
            });
        }

        // Mettre à jour l'animateur
        const { data, error } = await supabase
            .from('vacance_animateur')
            .update({
                annee: parseInt(annee),
                nom,
                prenom,
                fonction,
                naissance: dateNaissance.toISOString().split('T')[0],
                sexe: sexe.toUpperCase(),
                section,
                religion
            })
            .eq('id', animateurId)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Animateur non trouvé"
            });
        }

        res.json({
            success: true,
            message: "Animateur modifié avec succès",
            animateur: data[0]
        });
    } catch (err) {
        console.error('Erreur lors de la modification de l\'animateur:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Erreur lors de la modification de l\'animateur'
        });
    }
};

module.exports = updateVacanceAnimateur;