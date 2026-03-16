
const supabase = require('../config/supabase');

const updateVacanceDirecteur = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            annee,
            nom,
            prenom,
            fonction,
            naissance
        } = req.body;

        console.log('Mise à jour du directeur:', id, { annee, nom, prenom, fonction, naissance });

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "L'ID du directeur est requis"
            });
        }

        const { data, error } = await supabase
            .from('vacance_directeur')
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

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Directeur non trouvé"
            });
        }

        res.json({
            success: true,
            message: "Directeur mis à jour avec succès",
            directeur: data
        });
    } catch (err) {
        console.error('Erreur lors de la mise à jour du directeur:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du directeur',
            error: err.message || err
        });
    }
};

module.exports = updateVacanceDirecteur;