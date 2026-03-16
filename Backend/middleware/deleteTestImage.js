const supabase = require('../config/supabase');

const deleteTestImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    console.log('Suppression de l\'image ID:', imageId);

    // Récupérer les informations de l'image
    const { data: image, error: fetchError } = await supabase
      .from('test_images')
      .select('*')
      .eq('id', imageId)
      .single();

    if (fetchError || !image) {
      console.log('Image non trouvée:', imageId);
      return res.status(404).json({
        success: false,
        message: 'Image non trouvée'
      });
    }

    console.log('Image trouvée:', image);

    // Supprimer le fichier du Storage
    console.log('Suppression du fichier du Storage:', image.file_path);
    const { error: storageError } = await supabase.storage
      .from('images')
      .remove([image.file_path]);

    if (storageError) {
      console.error('Erreur lors de la suppression du Storage:', storageError);
      // Continuer quand même pour supprimer l'entrée de la base de données
    }

    // Supprimer l'entrée de la base de données
    console.log('Suppression de l\'entrée de la base de données...');
    const { error: deleteError } = await supabase
      .from('test_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      console.error('Erreur lors de la suppression de la base de données:', deleteError);
      throw deleteError;
    }

    console.log('Image supprimée avec succès');

    res.json({
      success: true,
      message: 'Image supprimée avec succès'
    });

  } catch (error) {
    console.error('Error in deleteTestImage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'image',
      error: error.message
    });
  }
};

module.exports = deleteTestImage;
