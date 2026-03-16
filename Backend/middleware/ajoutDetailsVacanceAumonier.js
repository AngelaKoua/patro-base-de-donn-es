

const supabase = require('../config/supabase');

const ajoutDetailsVacanceAumonier = async (req, res) => {
    try {
        const { aumonier_id } = req.params;  // Récupérer l'ID depuis les paramètres d'URL
        const { realisation, email, whatsapp, autre_contact } = req.body;
        
        console.log('Ajout/Mise à jour des détails de l\'aumônier:', { 
            aumonier_id, 
            realisation, 
            email, 
            whatsapp, 
            autre_contact 
        });

        // Vérifier si l'aumônier existe
        const { data: aumonier, error: aumonierError } = await supabase
            .from('vacance_aumonier')
            .select('id')
            .eq('id', aumonier_id)
            .single();

        if (aumonierError || !aumonier) {
            return res.status(404).json({
                success: false,
                message: "Aumônier non trouvé"
            });
        }

        // Vérifier si des détails existent déjà
        const { data: existingDetails, error: checkError } = await supabase
            .from('detail_aumonier_vacance')
            .select('*')
            .eq('aumonier_id', aumonier_id)
            .single();

        let result;
        
        if (existingDetails) {
            // Mise à jour
            const { data, error } = await supabase
                .from('detail_aumonier_vacance')
                .update({
                    realisation,
                    email,
                    whatsapp,
                    autre_contact
                })
                .eq('aumonier_id', aumonier_id)
                .select()
                .single();

            if (error) {
                console.error('Erreur lors de la mise à jour:', error);
                throw error;
            }
            
            result = { 
                success: true, 
                message: "Détails mis à jour avec succès",
                data
            };
        } else {
            // Insertion
            const { data, error } = await supabase
                .from('detail_aumonier_vacance')
                .insert([{
                    aumonier_id,
                    realisation,
                    email,
                    whatsapp,
                    autre_contact
                }])
                .select()
                .single();

            if (error) {
                console.error('Erreur lors de l\'insertion:', error);
                throw error;
            }
            
            result = { 
                success: true, 
                message: "Détails ajoutés avec succès",
                data
            };
        }

        res.json(result);
    } catch (err) {
        console.error('Erreur lors de l\'ajout/mise à jour des détails:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout/mise à jour des détails',
            error: err.message || err
        });
    }
};

module.exports = ajoutDetailsVacanceAumonier;
// ...fin du module...