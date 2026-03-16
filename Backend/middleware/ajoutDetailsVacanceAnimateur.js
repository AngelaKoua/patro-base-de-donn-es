const supabase = require('../config/supabase');

module.exports = async (req, res) => {
    console.log('--- ajoutDetailsVacanceAnimateur ---');
    console.log('Body reçu :', req.body);
    const {
        animateur_id,
        email,
        contact_whatsapp,
        autre_contact,
        religion,
        realisation,
        communaute,
        est_catechumene,
        est_bapteme,
        est_premiere_communion,
        est_confirmation
    } = req.body;

    if (!animateur_id) {
        console.warn('animateur_id manquant pour ajoutDetailsVacanceAnimateur');
        return res.status(400).json({ success: false, error: "animateur_id requis." });
    }

    try {
        // Vérifier si les détails existent déjà
        const { data: existingDetails } = await supabase
            .from('details_vacance_animateur')
            .select('id')
            .eq('animateur_id', animateur_id)
            .single();

        if (existingDetails) {
            // Mise à jour
            const { data: updatedData, error: updateError } = await supabase
                .from('details_vacance_animateur')
                .update({
                    email,
                    contact_whatsapp,
                    autre_contact,
                    religion,
                    realisation,
                    communaute,
                    est_catechumene,
                    est_bapteme,
                    est_premiere_communion,
                    est_confirmation
                })
                .eq('animateur_id', animateur_id)
                .select();

            if (updateError) throw updateError;
            
            console.log('Détails mis à jour pour animateur_id:', animateur_id);
            res.json({ 
                success: true, 
                message: "Détails mis à jour",
                details: updatedData[0]
            });
        } else {
            // Insertion
            const { data: insertedData, error: insertError } = await supabase
                .from('details_vacance_animateur')
                .insert([{
                    animateur_id,
                    email,
                    contact_whatsapp,
                    autre_contact,
                    religion,
                    realisation,
                    communaute,
                    est_catechumene,
                    est_bapteme,
                    est_premiere_communion,
                    est_confirmation
                }])
                .select();

            if (insertError) throw insertError;
            
            console.log('Détails ajoutés pour animateur_id:', animateur_id);
            res.json({ 
                success: true, 
                message: "Détails ajoutés",
                details: insertedData[0]
            });
        }
    } catch (err) {
        console.error('Erreur SQL ajoutDetailsVacanceAnimateur:', err);
        res.status(500).json({ success: false, error: err });
    }
};