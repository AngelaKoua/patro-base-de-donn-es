const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  const evenement_id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  
  try {
    console.log('Recherche des informations pour l\'événement:', evenement_id);
    
    // Récupérer d'abord les informations de base de l'événement
    const { data: evenementData, error: evenementError } = await supabase
      .from('scolaire_evenement')
      .select('*')
      .eq('id', evenement_id)
      .single();

    if (evenementError) {
      console.error('Erreur lors de la récupération de l\'événement:', evenementError);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'événement',
        error: evenementError.message
      });
    }

    if (!evenementData) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Ensuite, récupérer les détails de l'événement
    const { data: detailData, error: detailError } = await supabase
      .from('detail_evenement_scolaire')
      .select('*')
      .eq('evenement_id', evenement_id)
      .single();

    let detail = null;
    if (!detailError) {
      detail = {
        ...detailData,
        photos: detailData ? [
          detailData.photo1, detailData.photo2, detailData.photo3, detailData.photo4, detailData.photo5,
          detailData.photo6, detailData.photo7, detailData.photo8, detailData.photo9, detailData.photo10
        ].filter(p => p) : [], // Enlever les valeurs null/undefined/vides
        video: detailData?.video || ""
      };
    } else if (detailError.code !== 'PGRST116') { // Si l'erreur n'est pas "Not Found"
      console.error('Erreur lors de la récupération des détails:', detailError);
    }

    console.log('Informations récupérées avec succès');
    res.json({ 
      success: true,
      evenement: evenementData,
      detail
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération des informations',
      error: err.message 
    });
  }
};