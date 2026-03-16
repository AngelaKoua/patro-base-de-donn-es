const supabase = require('../config/supabase');

const deleteVacanceAnimateur = async (req, res) => {
    try {
        const animateurId = req.params.id;

        if (!animateurId) {
            return res.status(400).json({
                success: false,
                message: "L'ID de l'animateur est requis"
            });
        }

        // Vérifier si l'animateur existe avant de le supprimer
        const { data: existingAnimateur, error: checkError } = await supabase
            .from('vacance_animateur')
            .select('id')
            .eq('id', animateurId)
            .single();

        if (checkError) {
            throw checkError;
        }

        if (!existingAnimateur) {
            return res.status(404).json({
                success: false,
                message: "Animateur non trouvé"
            });
        }

        // Les détails et photos seront automatiquement supprimés grâce à la contrainte ON DELETE CASCADE
        const { error } = await supabase
            .from('vacance_animateur')
            .delete()
            .eq('id', animateurId);

        if (error) throw error;

        res.json({
            success: true,
            message: "Animateur et ses données associées supprimés avec succès"
        });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'animateur:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Erreur lors de la suppression de l\'animateur'
        });
    }
};

module.exports = deleteVacanceAnimateur;