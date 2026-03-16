const supabase = require('../config/supabase');

const deleteSimplePhoto = async (req, res) => {
  try {
    const photoId = req.params.id;
    console.log('=== Delete Photo ID:', photoId, '===');

    // Récupérer la photo
    const { data: photo, error: fetchError } = await supabase
      .from('test_photos')
      .select('*')
      .eq('id', photoId)
      .single();

    if (fetchError || !photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo non trouvée'
      });
    }

    console.log('Photo trouvée:', photo.file_path);

    // Supprimer du Storage
    const { error: storageError } = await supabase.storage
      .from('images')
      .remove([photo.file_path]);

    if (storageError) {
      console.error('Storage error:', storageError);
    }

    // Supprimer de la DB
    const { error: deleteError } = await supabase
      .from('test_photos')
      .delete()
      .eq('id', photoId);

    if (deleteError) {
      console.error('Database error:', deleteError);
      throw deleteError;
    }

    console.log('Photo supprimée avec succès');

    res.json({
      success: true,
      message: 'Photo supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};

module.exports = deleteSimplePhoto;
