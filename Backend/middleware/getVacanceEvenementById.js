const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log('Récupération des informations pour l\'événement de vacances:', id);
    
    // Récupération simultanée des informations de base et des détails
    const [evenementResult, detailResult] = await Promise.all([
      supabase
        .from('evenement_vacance')
        .select('*')
        .eq('id', id)
        .single(),
      supabase
        .from('detail_evenement_vacance')
        .select('*')
        .eq('evenement_id', id)
        .single()
    ]);

    // Gestion des erreurs des requêtes
    if (evenementResult.error) {
      console.error('Erreur lors de la récupération de l\'événement:', evenementResult.error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'événement',
        error: evenementResult.error.message
      });
    }

    if (!evenementResult.data) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Format de la réponse
    const responseData = {
      success: true,
      evenement: evenementResult.data,
      detail: null
    };

    // Si on a des détails, on les ajoute
    if (!detailResult.error && detailResult.data) {
      responseData.detail = {
        ...detailResult.data,
        photos: [
          detailResult.data.photo1, detailResult.data.photo2, detailResult.data.photo3,
          detailResult.data.photo4, detailResult.data.photo5, detailResult.data.photo6,
          detailResult.data.photo7, detailResult.data.photo8, detailResult.data.photo9,
          detailResult.data.photo10
        ].filter(Boolean), // Enlève les valeurs null/undefined/vides
        video: detailResult.data.video || ""
      };
    }

    console.log('Informations récupérées avec succès');
    return res.json(responseData);

  } catch (err) {
    console.error('Erreur serveur:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération des informations',
      error: err.message 
    });
  }
};
