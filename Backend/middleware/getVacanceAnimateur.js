const supabase = require('../config/supabase');

const getVacanceAnimateur = async (req, res) => {
    try {
        const animateurId = parseInt(req.params.id);

        if (!animateurId) {
            return res.status(400).json({
                success: false,
                message: "L'ID de l'animateur est requis"
            });
        }

        console.log(`📋 Récupération animateur vacance ID: ${animateurId}`);

        // ✅ 1. Récupérer les informations de base
        const { data: animateur, error: animateurError } = await supabase
            .from('vacance_animateur')
            .select('*')
            .eq('id', animateurId)
            .maybeSingle();

        if (animateurError) {
            console.error('❌ Erreur récupération animateur:', animateurError);
            throw animateurError;
        }

        if (!animateur) {
            return res.status(404).json({
                success: false,
                message: "Animateur non trouvé"
            });
        }

        console.log('✅ Animateur trouvé:', animateur.nom, animateur.prenom);

        // ✅ 2. Récupérer les détails
        const { data: details, error: detailsError } = await supabase
            .from('details_vacance_animateur')
            .select('*')
            .eq('animateur_id', animateurId)
            .maybeSingle();

        if (detailsError && detailsError.code !== 'PGRST116') {
            console.error('⚠️ Erreur détails:', detailsError);
        }

        console.log('📝 Détails trouvés:', details ? 'Oui' : 'Non');

        // ✅ 3. Récupérer la photo depuis la TABLE UNIFIÉE "photos"
        const { data: photoRecord, error: photoError } = await supabase
            .from('photos')
            .select('public_url, file_path')
            .eq('vacance_animateur_id', animateurId)
            .maybeSingle();

        if (photoError && photoError.code !== 'PGRST116') {
            console.error('⚠️ Erreur photo:', photoError);
        }

        console.log('📸 Photo trouvée:', photoRecord ? photoRecord.public_url : 'Non');

        // ✅ 4. Combiner toutes les données
        const animateurComplet = {
            ...animateur,
            ...(details || {}),
            photo: photoRecord?.public_url || null // URL publique Supabase Storage
        };

        console.log('📦 Données complètes:', {
            id: animateurComplet.id,
            nom: animateurComplet.nom,
            photo: animateurComplet.photo
        });

        // ✅ 5. Désactiver le cache
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        res.json({
            success: true,
            animateur: animateurComplet
        });

    } catch (err) {
        console.error('❌ Erreur lors de la récupération de l\'animateur:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Erreur lors de la récupération de l\'animateur'
        });
    }
};

module.exports = getVacanceAnimateur;