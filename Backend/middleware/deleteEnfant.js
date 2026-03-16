const supabase = require('../config/supabase');

const deleteEnfant = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID manquant"
            });
        }

        // Supprimer d'abord les détails liés à l'enfant (clé étrangère)
        const { error: detailsError } = await supabase
            .from('details_enfants_scolaire')
            .delete()
            .eq('enfant_id', id);
            
        if (detailsError) {
            console.error('Erreur lors de la suppression des détails:', detailsError);
            throw detailsError;
        }

        // Puis supprimer l'enfant
        const { error, data } = await supabase
            .from('patronier_scolaire')
            .delete()
            .eq('id', id)
            .select();
        if (error) throw error;
        
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Enfant non trouvé"
            });
        }

        res.json({
            success: true,
            message: "Enfant supprimé avec succès"
        });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la suppression de l'enfant"
        });
    }
};

module.exports = deleteEnfant;