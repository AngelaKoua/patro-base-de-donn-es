
const supabase = require('../config/supabase');

const addVacanceDirecteur = async (req, res) => {
    try {
        const {
            annee,
            nom,
            prenom,
            fonction,
            naissance
        } = req.body;

        console.log('Ajout d\'un nouveau directeur de vacances:', { annee, nom, prenom, fonction, naissance });

        // Validation des données requises
        if (!nom || !prenom || !fonction || !annee || !naissance) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs sont requis"
            });
        }

        const { data, error } = await supabase
            .from('vacance_directeur')
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
            message: "Directeur ajouté avec succès",
            directeurId: data.id
        });
    } catch (err) {
        console.error('Erreur lors de l\'ajout du directeur:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout du directeur',
            error: err.message || err
        });
    }
};

module.exports = addVacanceDirecteur;