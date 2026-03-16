const { supabase } = require('../config/supabase');

module.exports = async (req, res) => {
  const { id } = req.params;
  const { annee, evenement, date_debut, date_fin, cible } = req.body;
  
  try {
    console.log('Modification événement scolaire:', { id, annee, evenement, date_debut, date_fin, cible });
    
    const { data, error } = await supabase
      .from('evenement_scolaire')
      .update({
        annee,
        evenement,
        date_debut,
        date_fin,
        cible
      })
      .eq('id', id);

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la modification de l\'événement',
        error: error.message 
      });
    }

    console.log('Événement modifié avec succès:', data);
    res.json({ 
      success: true,
      message: 'Événement modifié avec succès',
      data 
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la modification',
      error: err.message 
    });
  }
};