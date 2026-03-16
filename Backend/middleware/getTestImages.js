const supabase = require('../config/supabase');

const getTestImages = async (req, res) => {
  try {
    console.log('Récupération de toutes les images de test...');
    
    const { data: images, error } = await supabase
      .from('test_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des images:', error);
      throw error;
    }

    console.log(`${images.length} images trouvées`);

    res.json({
      success: true,
      images: images,
      count: images.length
    });

  } catch (error) {
    console.error('Error in getTestImages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des images',
      error: error.message
    });
  }
};

module.exports = getTestImages;
