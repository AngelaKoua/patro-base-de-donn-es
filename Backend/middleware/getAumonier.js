const supabase = require('../config/supabase');

const getAumonier = async (req, res) => {
  const aumonierId = parseInt(req.params.id);

  try {
    console.log(`📋 Récupération aumônier scolaire ID: ${aumonierId}`);

    // ✅ 1. Récupérer les informations de base
    const { data: aumonier, error: aumonierError } = await supabase
      .from('scolaire_aumonier')
      .select('*')
      .eq('id', aumonierId)
      .single();

    if (aumonierError) throw aumonierError;

    if (!aumonier) {
      return res.status(404).json({
        success: false,
        message: 'Aumônier non trouvé'
      });
    }

    console.log('✅ Aumônier trouvé:', aumonier.nom, aumonier.prenom);

    // ✅ 2. Récupérer les détails
    const { data: details, error: detailsError } = await supabase
      .from('details_aumonier_scolaire')
      .select('realisation, email, whatsapp, autre_contact')
      .eq('aumonier_id', aumonierId)
      .single();

    if (detailsError && detailsError.code !== 'PGRST116') {
      console.error('⚠️ Erreur détails:', detailsError);
    }

    console.log('📝 Détails trouvés:', details ? 'Oui' : 'Non');

    // ✅ 3. Récupérer la photo depuis la TABLE UNIFIÉE "photos"
    const { data: photoRecord, error: photoError } = await supabase
      .from('photos')
      .select('public_url, file_path')
      .eq('aumonier_id', aumonierId)
      .maybeSingle();

    if (photoError && photoError.code !== 'PGRST116') {
      console.error('⚠️ Erreur photo:', photoError);
    }

    console.log('📸 Photo trouvée:', photoRecord ? photoRecord.public_url : 'Non');

    // ✅ 4. Combiner toutes les données
    const aumonierComplet = {
      ...aumonier,
      ...details,
      photo: photoRecord?.public_url || null // URL publique Supabase Storage
    };

    res.json({
      success: true,
      aumonier: aumonierComplet
    });

  } catch (err) {
    console.error('❌ Erreur lors de la récupération de l\'aumônier:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de la récupération de l\'aumônier'
    });
  }
};

module.exports = getAumonier;