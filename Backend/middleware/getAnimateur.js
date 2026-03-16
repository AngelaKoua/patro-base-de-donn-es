const supabase = require('../config/supabase');

const getAnimateur = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID de l'animateur non fourni"
    });
  }

  try {
    console.log(`📋 Récupération animateur scolaire ID: ${id}`);

    // ✅ 1. Récupérer les informations de base
    const { data: animateur, error: animateurError } = await supabase
      .from('scolaire_animateur')
      .select('*')
      .eq('id', id)
      .single();

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
      .from('details_animateurs_scolaire')
      .select('*')
      .eq('animateur_id', id)
      .maybeSingle();

    if (detailsError && detailsError.code !== 'PGRST116') {
      console.error('⚠️ Erreur détails:', detailsError);
    }

    console.log('📝 Détails trouvés:', details ? 'Oui' : 'Non');

    // ✅ 3. Récupérer la photo depuis la TABLE UNIFIÉE "photos"
    // Dans getAnimateur.js
    const { data: photoRecord, error: photoError } = await supabase
      .from('photos')
      .select('*')  // ✅ Sélectionne tout pour debug
      .eq('animateur_id', id)
      .maybeSingle();

    console.log('🔍 QUERY:', `SELECT * FROM photos WHERE animateur_id = ${id}`);
    console.log('🔍 photoRecord RAW:', JSON.stringify(photoRecord, null, 2));
    console.log('🔍 photoError:', photoError);
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

  } catch (error) {
    console.error("❌ Erreur lors de la récupération de l'animateur:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Erreur lors de la récupération de l'animateur"
    });
  }
};

module.exports = getAnimateur;