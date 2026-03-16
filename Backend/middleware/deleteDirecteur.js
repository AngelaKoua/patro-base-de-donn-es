const supabase = require('../config/supabase');

const deleteDirecteur = async (req, res) => {
  const directeurId = parseInt(req.params.id);

  try {
    // Vérifier si le directeur existe
    const { data: existingDirecteur, error: checkError } = await supabase
      .from('scolaire_directeur')
      .select('id')
      .eq('id', directeurId)
      .single();

    if (checkError || !existingDirecteur) {
      return res.status(404).json({
        success: false,
        message: 'Directeur non trouvé'
      });
    }

    // Supprimer le directeur
    const { error } = await supabase
      .from('scolaire_directeur')
      .delete()
      .eq('id', directeurId);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Directeur supprimé avec succès'
    });
  } catch (err) {
    console.error('Erreur lors de la suppression du directeur:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de la suppression du directeur'
    });
  }
};

module.exports = deleteDirecteur;