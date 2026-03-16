const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  const {
    evenement_id, lieu, description, objectif,
    nb_patronnes_attendus, nb_patronnes_presents, taux_participation_patronnes,
    nb_animateurs_attendus, nb_animateurs_presents, taux_participation_animateurs,
    partenaires, autres_personnes_ressources, financement,
    aspects_positifs, aspects_negatifs, suggestions,
    photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10, video
  } = req.body;

  if (!evenement_id) {
    return res.status(400).json({ success: false, message: "evenement_id obligatoire" });
  }

  try {
    console.log('Recherche des détails existants pour l\'événement:', evenement_id);
    
    // Vérifier si des détails existent déjà
    const { data: existingDetails, error: searchError } = await supabase
      .from('detail_evenement_scolaire')
      .select('id')
      .eq('evenement_id', evenement_id)
      .single();

    if (searchError && searchError.code !== 'PGRST116') { // PGRST116 = Not Found
      console.error('Erreur lors de la recherche des détails:', searchError);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche des détails',
        error: searchError.message
      });
    }

    const detailsData = {
      evenement_id,
      lieu,
      description,
      objectif,
      nb_patronnes_attendus,
      nb_patronnes_presents,
      taux_participation_patronnes,
      nb_animateurs_attendus,
      nb_animateurs_presents,
      taux_participation_animateurs,
      partenaires,
      autres_personnes_ressources,
      financement,
      aspects_positifs,
      aspects_negatifs,
      suggestions,
      photo1, photo2, photo3, photo4, photo5,
      photo6, photo7, photo8, photo9, photo10,
      video,
      photos: [], // Champ JSON pour stocker les URLs des photos
      videos: [] // Champ JSON pour stocker les URLs des vidéos
    };

    if (existingDetails) {
      // Mise à jour
      console.log('Mise à jour des détails existants');
      const { error: updateError } = await supabase
        .from('detail_evenement_scolaire')
        .update(detailsData)
        .eq('evenement_id', evenement_id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour:', updateError);
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de la mise à jour des détails',
          error: updateError.message
        });
      }

      return res.json({ 
        success: true, 
        message: "Détails mis à jour avec succès" 
      });
    } else {
      // Insertion
      console.log('Création de nouveaux détails');
      const { error: insertError } = await supabase
        .from('detail_evenement_scolaire')
        .insert([detailsData]);

      if (insertError) {
        console.error('Erreur lors de l\'insertion:', insertError);
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'ajout des détails',
          error: insertError.message
        });
      }

      return res.json({ 
        success: true, 
        message: "Détails ajoutés avec succès" 
      });
    }
  } catch (err) {
    console.error('Erreur serveur:', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du traitement des détails',
      error: err.message
    });
  }
};