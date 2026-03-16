
const supabase = require('../config/supabase');

const deleteVacanceDirecteur = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Suppression du directeur:', id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "L'ID du directeur est requis"
            });
        }

        // D'abord supprimer les détails associés
        await supabase
            .from('details_vacance_directeur')
            .delete()
            .eq('directeur_id', id);

        // Ensuite supprimer le directeur
        const { error } = await supabase
            .from('vacance_directeur')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erreur Supabase:', error);
            throw error;
        }

        res.json({
            success: true,
            message: "Directeur supprimé avec succès"
        });
    } catch (err) {
        console.error('Erreur lors de la suppression du directeur:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du directeur',
            error: err.message || err
        });
    }
};

module.exports = deleteVacanceDirecteur;