const supabase = require('../config/supabase');

// Ajoute ou met à jour les détails d'un évènement vacances
module.exports = async (req, res) => {
  const { 
    evenement_id, lieu, description, objectif,
    nb_patronnes_attendus, nb_patronnes_presents, taux_participation_patronnes,
    nb_animateurs_attendus, nb_animateurs_presents, taux_participation_animateurs,
    partenaires, autres_personnes_ressources, financement,
    aspects_positifs, aspects_negatifs, suggestions,
    photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10, video
  } = req.body;

  try {
    console.log('Données reçues:', req.body);
    
    // Validation des données requises
    if (!evenement_id) {
      console.log('Erreur: evenement_id manquant');
      return res.status(400).json({ 
        success: false, 
        message: "L'identifiant de l'événement est obligatoire" 
      });
    }

    // Validation que l'événement existe
    const { data: evenement, error: evenementError } = await supabase
      .from('evenement_vacance')
      .select('id')
      .eq('id', evenement_id)
      .single();

    if (evenementError || !evenement) {
      return res.status(404).json({ 
        success: false, 
        message: "L'événement spécifié n'existe pas" 
      });
    }

    // Conversion des valeurs numériques
    // Prépare les données à insérer/mettre à jour
    const detailData = {
      evenement_id,
      lieu: lieu || '',
      description: description || '',
      objectif: objectif || '',
      nb_patronnes_attendus: parseInt(nb_patronnes_attendus) || 0,
      nb_patronnes_presents: parseInt(nb_patronnes_presents) || 0,
      taux_participation_patronnes: parseFloat(taux_participation_patronnes) || 0,
      nb_animateurs_attendus: parseInt(nb_animateurs_attendus) || 0,
      nb_animateurs_presents: parseInt(nb_animateurs_presents) || 0,
      taux_participation_animateurs: parseFloat(taux_participation_animateurs) || 0,
      partenaires: partenaires || '',
      autres_personnes_ressources: autres_personnes_ressources || '',
      financement: financement || '',
      aspects_positifs: aspects_positifs || '',
      aspects_negatifs: aspects_negatifs || '',
      suggestions: suggestions || '',
      photo1: photo1 || null,
      photo2: photo2 || null,
      photo3: photo3 || null,
      photo4: photo4 || null,
      photo5: photo5 || null,
      photo6: photo6 || null,
      photo7: photo7 || null,
      photo8: photo8 || null,
      photo9: photo9 || null,
      photo10: photo10 || null,
      video: video || null,
      // Ajoute les champs JSONB
      photos: JSON.stringify([photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10].filter(Boolean)),
      videos: JSON.stringify([video].filter(Boolean))
    };

    // Vérifier si les détails existent déjà
    const { data: existingDetail } = await supabase
      .from('detail_evenement_vacance')
      .select('id')
      .eq('evenement_id', evenement_id)
      .single();

    let result;
    if (existingDetail) {
      // Mise à jour
      result = await supabase
        .from('detail_evenement_vacance')
        .update(detailData)
        .eq('evenement_id', evenement_id);
    } else {
      // Insertion
      result = await supabase
        .from('detail_evenement_vacance')
        .insert([detailData]);
    }

    if (result.error) {
      console.error('Erreur Supabase:', result.error);
      console.error('Détails de l\'erreur:', JSON.stringify(result.error, null, 2));
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de l\'enregistrement des détails',
        error: result.error.message,
        details: result.error 
      });
    }

    return res.json({ 
      success: true, 
      message: existingDetail ? "Détails mis à jour" : "Détails ajoutés" 
    });

  } catch (err) {
    console.error('Erreur serveur:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'enregistrement des détails',
      error: err.message 
    });
  }
};