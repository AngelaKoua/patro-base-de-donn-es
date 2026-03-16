const supabase = require('../config/supabase');

const deleteTestPhoto = async (req, res) => {
  try {
    const photoId = req.params.id;
    console.log('=== Suppression de la photo ID:', photoId, '===');

    // Récupérer les informations de la photo
    const { data: photo, error: fetchError } = await supabase
      .from('photos')
      .select('*')
      .eq('id', photoId)
      .single();

    if (fetchError || !photo) {
      console.log('Photo non trouvée:', photoId);
      return res.status(404).json({
        success: false,
        message: 'Photo non trouvée'
      });
    }

    console.log('Photo trouvée:', photo);

    // Supprimer le fichier du Storage
    console.log('Suppression du fichier du Storage:', photo.file_path);
    const { error: storageError } = await supabase.storage
      .from('images')
      .remove([photo.file_path]);

    if (storageError) {
      console.error('Erreur lors de la suppression du Storage:', storageError);
      // Continuer quand même pour supprimer l'entrée de la base de données
    }

    // Supprimer l'entrée de la base de données
    console.log('Suppression de l\'entrée de la base de données...');
    const { error: deleteError } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId);

    if (deleteError) {
      console.error('Erreur lors de la suppression de la base de données:', deleteError);
      throw deleteError;
    }

    console.log('Photo supprimée avec succès');

    res.json({
      success: true,
      message: 'Photo supprimée avec succès'
    });

  } catch (error) {
    console.error('Error in deleteTestPhoto:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la photo',
      error: error.message
    });
  }
};

module.exports = deleteTestPhoto;
