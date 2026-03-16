const supabase = require('../config/supabase');

const ajoutVacanceAnimateur = async (req, res) => {
    try {
        const { annee, nom, prenom, fonction, naissance, sexe, section, religion } = req.body;

        // Validation des champs requis
        if (!annee || !nom || !prenom || !fonction || !naissance || !sexe || !section || !religion) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs sont obligatoires"
            });
        }

        // Validation du sexe
        if (!['M', 'F'].includes(sexe.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Le sexe doit être "M" ou "F"'
            });
        }

        // Insérer l'animateur
        const { data, error } = await supabase
            .from('vacance_animateur')
            .insert([{
                annee: parseInt(annee),
                nom,
                prenom,
                fonction,
                naissance,
                sexe: sexe.toUpperCase(),
                section,
                religion
            }])
            .select();

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: "Animateur ajouté avec succès",
            animateur: data[0]
        });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de l\'animateur:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Erreur lors de l\'ajout de l\'animateur'
        });
    }
};

module.exports = ajoutVacanceAnimateur;