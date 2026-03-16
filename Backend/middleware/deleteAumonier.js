const supabase = require('../config/supabase');

const deleteAumonier = async (req, res) => {
  const aumonierId = parseInt(req.params.id);

  try {
    // Vérifier si l'aumônier existe
    const { data: existingAumonier, error: checkError } = await supabase
      .from('scolaire_aumonier')
      .select('id')
      .eq('id', aumonierId)
      .single();

    if (checkError || !existingAumonier) {
      return res.status(404).json({
        success: false,
        message: 'Aumônier non trouvé'
      });
    }

    // Supprimer l'aumônier
    const { error } = await supabase
      .from('scolaire_aumonier')
      .delete()
      .eq('id', aumonierId);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Aumônier supprimé avec succès'
    });
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'aumônier:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de la suppression de l\'aumônier'
    });
  }
};

module.exports = deleteAumonier;