const supabase = require('../config/supabase');

const getVacanceDirecteur = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "L'ID du directeur est requis"
            });
        }

        console.log(`📋 Récupération directeur vacance ID: ${id}`);

        // ✅ 1. Récupérer les informations de base
        const { data: directeur, error: directeurError } = await supabase
            .from('vacance_directeur')
            .select('*')
            .eq('id', id)
            .single();

        if (directeurError) {
            console.error('❌ Erreur récupération directeur:', directeurError);
            throw directeurError;
        }

        if (!directeur) {
            return res.status(404).json({
                success: false,
                message: "Directeur non trouvé"
            });
        }

        console.log('✅ Directeur trouvé:', directeur.nom, directeur.prenom);

        // ✅ 2. Récupérer les détails
        const { data: details, error: detailsError } = await supabase
            .from('detail_directeur_vacance')
            .select('email, whatsapp, autre_contact, realisation')
            .eq('directeur_id', id)
            .maybeSingle();

        if (detailsError && detailsError.code !== 'PGRST116') {
            console.error('⚠️ Erreur détails:', detailsError);
        }

        console.log('📝 Détails trouvés:', details ? 'Oui' : 'Non');

        // ✅ 3. Récupérer la photo depuis la TABLE UNIFIÉE "photos"
        const { data: photoRecord, error: photoError } = await supabase
            .from('photos')
            .select('public_url, file_path')
            .eq('vacance_directeur_id', id)
            .maybeSingle();

        if (photoError && photoError.code !== 'PGRST116') {
            console.error('⚠️ Erreur photo:', photoError);
        }

        console.log('📸 Photo trouvée:', photoRecord ? photoRecord.public_url : 'Non');

        // ✅ 4. Combiner toutes les données
        const directeurComplet = {
            ...directeur,
            ...(details || {}),
            photo: photoRecord?.public_url || null // URL publique Supabase Storage
        };

        console.log('📦 Données complètes:', {
            id: directeurComplet.id,
            nom: directeurComplet.nom,
            photo: directeurComplet.photo
        });

        // ✅ 5. Désactiver le cache
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        res.json({
            success: true,
            directeur: directeurComplet
        });

    } catch (err) {
        console.error('❌ Erreur lors de la récupération du directeur:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du directeur',
            error: err.message || err
        });
    }
};

module.exports = getVacanceDirecteur;