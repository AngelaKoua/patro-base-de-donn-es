const supabase = require('../config/supabase');

const ajoutDetailsAnimateur = async (req, res) => {
  const {
    animateur_id,
    email,
    contact_whatsapp,
    autre_contact,
    religion,
    realisation,
    communaute,
    est_catechumene,
    est_bapteme,
    est_premiere_communion,
    est_confirmation
  } = req.body;

  try {
    // Vérifier si des détails existent déjà pour cet animateur
    const { data: existingDetails, error: selectError } = await supabase
      .from('details_animateurs_scolaire')
      .select('id')
      .eq('animateur_id', animateur_id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') throw selectError;

    const detailsData = {
      animateur_id,
      email,
      contact_whatsapp,
      autre_contact,
      religion,
      realisation,
      communaute,
      est_catechumene: !!est_catechumene,
      est_bapteme: !!est_bapteme,
      est_premiere_communion: !!est_premiere_communion,
      est_confirmation: !!est_confirmation
    };

    let result;
    if (existingDetails) {
      // Mise à jour
      result = await supabase
        .from('details_animateurs_scolaire')
        .update(detailsData)
        .eq('animateur_id', animateur_id)
        .select();
    } else {
      // Insertion
      result = await supabase
        .from('details_animateurs_scolaire')
        .insert(detailsData)
        .select();
    }

    if (result.error) throw result.error;

    return res.json({
      success: true,
      message: existingDetails ? 'Détails mis à jour' : 'Détails ajoutés',
      details: result.data[0]
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout/modification des détails:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'ajout/modification des détails'
    });
  }
};

module.exports = ajoutDetailsAnimateur;