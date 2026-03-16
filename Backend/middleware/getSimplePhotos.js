const supabase = require('../config/supabase');

const getSimplePhotos = async (req, res) => {
  try {
    console.log('=== Get Simple Photos ===');
    
    const { data: photos, error } = await supabase
      .from('test_photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`${photos.length} photo(s) trouvée(s)`);

    res.json({
      success: true,
      photos: photos,
      count: photos.length
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des photos',
      error: error.message
    });
  }
};

module.exports = getSimplePhotos;
