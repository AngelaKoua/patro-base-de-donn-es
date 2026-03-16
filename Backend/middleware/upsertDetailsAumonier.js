const supabase = require('../config/supabase');

const upsertDetailsAumonier = async (req, res) => {
  const { aumonier_id, realisation, email, whatsapp, autre_contact } = req.body;

  try {
    // Validation des données
    if (!aumonier_id) {
      return res.status(400).json({
        success: false,
        message: "ID de l'aumônier manquant"
      });
    }

    // Vérifier si l'aumônier existe
    const { data: aumonier, error: aumonierError } = await supabase
      .from('scolaire_aumonier')
      .select('id')
      .eq('id', aumonier_id)
      .single();

    if (aumonierError || !aumonier) {
      return res.status(404).json({
        success: false,
        message: 'Aumônier non trouvé'
      });
    }

    // Vérifier si des détails existent déjà
    const { data: existingDetails, error: checkError } = await supabase
      .from('details_aumonier_scolaire')
      .select('id')
      .eq('aumonier_id', aumonier_id)
      .single();

    let result;

    if (existingDetails) {
      // Mise à jour des détails existants
      const { data, error } = await supabase
        .from('details_aumonier_scolaire')
        .update({
          realisation,
          email,
          whatsapp,
          autre_contact
        })
        .eq('aumonier_id', aumonier_id)
        .select();

      if (error) throw error;
      result = { data, message: 'Détails mis à jour avec succès' };
    } else {
      // Générer un nouvel ID pour l'insertion
      const { data: maxId } = await supabase
        .from('details_aumonier_scolaire')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      const newId = maxId.length > 0 ? maxId[0].id + 1 : 1;

      // Insertion des nouveaux détails
      const { data, error } = await supabase
        .from('details_aumonier_scolaire')
        .insert([{
          id: newId,
          aumonier_id: parseInt(aumonier_id),
          realisation,
          email,
          whatsapp,
          autre_contact
        }])
        .select();

      if (error) throw error;
      result = { data, message: 'Détails ajoutés avec succès' };
    }

    res.json({
      success: true,
      message: result.message,
      details: result.data[0]
    });
  } catch (err) {
    console.error('Erreur lors de la gestion des détails de l\'aumônier:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de la gestion des détails de l\'aumônier'
    });
  }
};

module.exports = upsertDetailsAumonier;