const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log('Suppression de l\'événement de vacances:', id);
    
    const { error } = await supabase
      .from('evenement_vacance')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la suppression de l\'événement',
        error: error.message 
      });
    }

    console.log('Événement supprimé avec succès');
    res.json({ 
      success: true,
      message: 'Événement supprimé avec succès'
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la suppression de l\'événement',
      error: err.message 
    });
  }
};