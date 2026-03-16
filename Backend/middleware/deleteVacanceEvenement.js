const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('Tentative de suppression de l\'événement avec l\'ID:', id);

    // Vérifier si l'événement existe avant de le supprimer
    const { data: existingEvent, error: checkError } = await supabase
      .from('evenement_vacance')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    const { error: deleteError } = await supabase
      .from('evenement_vacance')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Erreur Supabase lors de la suppression:', deleteError);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'événement',
        error: deleteError.message
      });
    }

    console.log('Événement supprimé avec succès');
    res.json({
      success: true,
      message: 'Événement supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression',
      error: error.message
    });
  }
};