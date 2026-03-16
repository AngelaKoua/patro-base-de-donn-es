const supabase = require('../config/supabase');

const deleteAnimateur = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de l'animateur non fourni"
      });
    }

    const { error, data } = await supabase
      .from('scolaire_animateur')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Animateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Animateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'animateur:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Erreur lors de la suppression de l'animateur"
    });
  }
};

module.exports = deleteAnimateur;

module.exports = deleteAnimateur;