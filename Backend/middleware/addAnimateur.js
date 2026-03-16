// middleware/addAnimateur.js
const supabase = require('../config/supabase');

const addAnimateur = async (req, res) => {
    try {
        const { nom, prenom, fonction, date_naissance, sexe, section, annee, religion } = req.body;

        console.log('📝 Ajout nouvel animateur scolaire:', { nom, prenom });

        // Validation
        if (!nom || !prenom) {
            return res.status(400).json({
                success: false,
                message: 'Le nom et le prénom sont requis'
            });
        }

        // Insertion dans la base
        const { data: animateur, error } = await supabase
            .from('scolaire_animateur')
            .insert([{
                nom,
                prenom,
                fonction: fonction || null,
                date_naissance: date_naissance || null,
                sexe: sexe || null,
                section: section || null,
                annee: annee || null,
                religion: religion || null
            }])
            .select()
            .single();

        if (error) {
            console.error('❌ Erreur insertion:', error);
            throw error;
        }

        console.log('✅ Animateur ajouté avec succès:', animateur.id);

        res.json({
            success: true,
            message: 'Animateur ajouté avec succès',
            animateur
        });

    } catch (err) {
        console.error('❌ Erreur lors de l\'ajout de l\'animateur:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Erreur lors de l\'ajout de l\'animateur'
        });
    }
};

module.exports = addAnimateur;