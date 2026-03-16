const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  const { id } = req.params;
  const { evenement, date_debut, date_fin, cible } = req.body;
  const annee = new Date(date_debut).getFullYear();

  // Validation des champs requis
  if (!evenement || !date_debut || !date_fin || !cible) {
    return res.status(400).json({
      success: false,
      message: "Tous les champs obligatoires doivent être remplis",
      missingFields: {
        evenement: !evenement,
        date_debut: !date_debut,
        date_fin: !date_fin,
        cible: !cible
      }
    });
  }

  try {
    console.log('Tentative de modification d\'un événement avec les données:', {
      id,
      annee,
      evenement,
      date_debut,
      date_fin,
      cible
    });

    const { data, error } = await supabase
      .from('evenement_vacance')
      .update({
        annee,
        evenement,
        date_debut,
        date_fin,
        cible
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la modification de l\'événement',
        error: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    console.log('Événement modifié avec succès:', data);
    res.json({
      success: true,
      message: 'Événement modifié avec succès',
      data
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la modification',
      error: error.message
    });
  }
};