const supabase = require('../config/supabase');

module.exports = async (req, res) => {
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
    console.log('Tentative d\'ajout d\'un événement avec les données:', { 
      annee,
      evenement,
      date_debut,
      date_fin,
      cible
    });
    console.log('Type des données:', {
      annee: typeof annee,
      evenement: typeof evenement,
      date_debut: typeof date_debut,
      date_fin: typeof date_fin,
      cible: typeof cible
    });
    
    const { data, error } = await supabase
      .from('evenement_vacance')
      .insert([
        { 
          annee,
          evenement,
          date_debut,
          date_fin,
          cible
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de l\'ajout de l\'événement',
        error: error.message 
      });
    }

    console.log('Événement ajouté avec succès:', data);
    res.json({ 
      success: true,
      message: 'Événement ajouté avec succès',
      id: data.id 
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'ajout de l\'événement',
      error: err.message 
    });
  }
};