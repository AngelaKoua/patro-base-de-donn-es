
const supabase = require('../config/supabase');

const deleteVacanceAumonier = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Tentative de suppression de l\'aumônier:', id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "L'ID de l'aumônier est requis"
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

        // Supprimer l'aumônier
        const { error } = await supabase
            .from('vacance_aumonier')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erreur Supabase:', error);
            throw error;
        }

        res.json({
            success: true,
            message: "Aumônier supprimé avec succès"
        });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'aumônier:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'aumônier',
            error: err.message || err
        });
    }
};

module.exports = deleteVacanceAumonier;