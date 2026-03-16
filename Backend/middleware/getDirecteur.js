const supabase = require('../config/supabase');

const getDirecteur = async (req, res) => {
  const directeurId = parseInt(req.params.id);

  try {
    console.log(`📋 Récupération directeur scolaire ID: ${directeurId}`);

    // ✅ 1. Récupérer les informations du directeur
    const { data: directeur, error: directeurError } = await supabase
      .from('scolaire_directeur')
      .select('*')
      .eq('id', directeurId)
      .single();

    if (directeurError) {
      console.error('❌ Erreur récupération directeur:', directeurError);
      throw directeurError;
    }

    if (!directeur) {
      return res.status(404).json({
        success: false,
        message: 'Directeur non trouvé'
      });
    }

    console.log('✅ Directeur trouvé:', directeur.nom, directeur.prenom);

    // ✅ 2. Récupérer les détails
    const { data: details, error: detailsError } = await supabase
      .from('details_directeurs_scolaire')
      .select('realisation, email, whatsapp, autre_contact')
      .eq('directeur_id', directeurId)
      .maybeSingle();

    if (detailsError && detailsError.code !== 'PGRST116') {
      console.error('⚠️ Erreur détails:', detailsError);
    }

    console.log('📝 Détails trouvés:', details ? 'Oui' : 'Non');

    // ✅ 3. Récupérer la photo depuis la TABLE UNIFIÉE "photos"
    const { data: photoRecord, error: photoError } = await supabase
      .from('photos')
      .select('public_url, file_path')
      .eq('directeur_id', directeurId)
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
      message: err.message || 'Erreur lors de la récupération du directeur'
    });
  }
};

module.exports = getDirecteur;