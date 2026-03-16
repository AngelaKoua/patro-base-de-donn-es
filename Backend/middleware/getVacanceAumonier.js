const supabase = require('../config/supabase');

const getVacanceAumonier = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID de l'aumônier requis"
            });
        }

        console.log(`📋 Récupération aumônier vacance ID: ${id}`);

        // ✅ 1. Récupérer les informations de base
        const { data: aumonier, error: aumonierError } = await supabase
            .from('vacance_aumonier')
            .select('*')
            .eq('id', id)
            .single();

        if (aumonierError) {
            console.error('❌ Erreur récupération aumônier:', aumonierError);
            throw aumonierError;
        }

        if (!aumonier) {
            return res.status(404).json({
                success: false,
                message: "Aumônier non trouvé"
            });
        }

        console.log('✅ Aumônier trouvé:', aumonier.nom, aumonier.prenom);

        // ✅ 2. Récupérer les détails
        const { data: details, error: detailsError } = await supabase
            .from('detail_aumonier_vacance')
            .select('email, whatsapp, autre_contact, realisation')
            .eq('aumonier_id', id)
            .maybeSingle();

        if (detailsError && detailsError.code !== 'PGRST116') {
            console.error('⚠️ Erreur détails:', detailsError);
        }

        console.log('📝 Détails trouvés:', details ? 'Oui' : 'Non');

        // ✅ 3. Récupérer la photo depuis la TABLE UNIFIÉE "photos"
        const { data: photoRecord, error: photoError } = await supabase
            .from('photos')
            .select('public_url, file_path')
            .eq('vacance_aumonier_id', id)
            .maybeSingle();

        if (photoError && photoError.code !== 'PGRST116') {
            console.error('⚠️ Erreur photo:', photoError);
        }

        console.log('📸 Photo trouvée:', photoRecord ? photoRecord.public_url : 'Non');

        // ✅ 4. Combiner toutes les données
        const aumonierComplet = {
            ...aumonier,
            ...(details || {}),
            photo: photoRecord?.public_url || null // URL publique Supabase Storage
        };

        console.log('📦 Données complètes:', {
            id: aumonierComplet.id,
            nom: aumonierComplet.nom,
            photo: aumonierComplet.photo
        });

        // ✅ 5. Désactiver le cache
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        res.json({
            success: true,
            aumonier: aumonierComplet
        });

    } catch (err) {
        console.error('❌ Erreur lors de la récupération de l\'aumônier:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'aumônier',
            error: err.message || err
        });
    }
};

module.exports = getVacanceAumonier;