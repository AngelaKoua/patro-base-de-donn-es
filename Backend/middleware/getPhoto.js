const supabase = require('../config/supabase');

const getPhoto = async (req, res) => {
  try {
    const enfantId = req.params.enfantId;
    console.log('Recherche de photo pour enfant_id:', enfantId);
    
    // Vérifier d'abord si l'enfant existe
    const { data: enfant, error: enfantError } = await supabase
      .from('patronier_scolaire')
      .select('id')
      .eq('id', enfantId)
      .single();

    if (enfantError || !enfant) {
      console.log('Enfant non trouvé:', enfantId);
      return res.status(404).json({
        success: false,
        message: 'Enfant non trouvé'
      });
    }

    console.log('Enfant trouvé, recherche de sa photo...');
    
    const { data: photo, error } = await supabase
      .from('photos')
      .select('file_path, public_url, mime_type')
      .eq('enfant_id', enfantId)
      .single();

    console.log('Résultat recherche photo:', {
      trouve: !!photo,
      erreur: error,
      donnees: photo
    });

    // PGRST116 signifie qu'aucune photo n'a été trouvée
    if (error && error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Photo non trouvée'
      });
    }

    if (error) {
      console.error('Error fetching photo:', error);
      throw error;
    }

    if (!photo || !photo.public_url) {
      return res.status(404).json({
        success: false,
        message: 'Photo non trouvée'
      });
    }

    try {
      res.json({
        success: true,
        url: photo.public_url,
        mime_type: photo.mime_type
      });
    } catch (error) {
      console.error('Error converting photo data:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la conversion des données de la photo',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Error in getPhoto:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la photo',
      error: error.message
    });
  }
};

module.exports = getPhoto;