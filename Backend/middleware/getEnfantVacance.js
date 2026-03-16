const supabase = require('../config/supabase');

const getEnfantVacance = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📋 Récupération enfant vacance ID: ${id}`);

    // ✅ 1. Récupérer les informations de base de l'enfant
    const { data: enfant, error: enfantError } = await supabase
      .from('enfants_vacance')
      .select('*')
      .eq('id', id)
      .single();

    if (enfantError) {
      if (enfantError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Enfant non trouvé'
        });
      }
      throw enfantError;
    }

    if (!enfant) {
      return res.status(404).json({
        success: false,
        message: 'Enfant non trouvé'
      });
    }

    console.log('✅ Enfant trouvé:', enfant.nom, enfant.prenom);

    // ✅ 2. Récupérer les détails complémentaires
    const { data: details, error: detailsError } = await supabase
      .from('details_enfant_vacance')
      .select('*')
      .eq('enfant_id', id)
      .single();

    if (detailsError && detailsError.code !== 'PGRST116') {
      console.error('⚠️ Erreur détails:', detailsError);
      throw detailsError;
    }

    console.log('📝 Détails trouvés:', details ? 'Oui' : 'Non');

    // ✅ 3. Récupérer la photo depuis la TABLE UNIFIÉE "photos"
    // avec le champ vacance_enfant_id
    const { data: photoRecord, error: photoError } = await supabase
      .from('photos')
      .select('public_url, file_path')
      .eq('vacance_enfant_id', id)
      .maybeSingle();

    if (photoError && photoError.code !== 'PGRST116') {
      console.error('⚠️ Erreur photo:', photoError);
      // Ne pas bloquer si erreur photo
    }

    console.log('📸 Photo trouvée:', photoRecord ? photoRecord.public_url : 'Non');

    // ✅ 4. Combiner toutes les données
    const enfantComplet = {
      ...enfant,
      ...(details || {}),
      photo: photoRecord?.public_url || null // URL publique Supabase Storage
    };

    res.json({
      success: true,
      enfant: enfantComplet
    });

  } catch (error) {
    console.error('❌ Erreur serveur getEnfantVacance:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des données',
      error: error.message
    });
  }
};

module.exports = getEnfantVacance;