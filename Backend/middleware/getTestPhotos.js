const supabase = require('../config/supabase');

const getTestPhotos = async (req, res) => {
  try {
    console.log('=== Récupération de toutes les photos ===');
    
    const { data: photos, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des photos:', error);
      throw error;
    }

    console.log(`${photos.length} photo(s) trouvée(s)`);

    res.json({
      success: true,
      photos: photos,
      count: photos.length
    });

  } catch (error) {
    console.error('Error in getTestPhotos:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des photos',
      error: error.message
    });
  }
};

module.exports = getTestPhotos;
