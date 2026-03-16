const supabase = require('../config/supabase');

const upsertDetailsDirecteur = async (req, res) => {
  const { directeur_id, realisation, email, whatsapp, autre_contact } = req.body;

  if (!directeur_id) {
    return res.status(400).json({ 
      success: false, 
      message: "ID du directeur manquant" 
    });
  }

  try {
    // Vérifier si le directeur existe
    const { data: directeur, error: directeurError } = await supabase
      .from('scolaire_directeur')
      .select('id')
      .eq('id', directeur_id)
      .single();

    if (directeurError || !directeur) {
      return res.status(404).json({
        success: false,
        message: 'Directeur non trouvé'
      });
    }

    // Vérifier si des détails existent déjà
    const { data: existingDetails, error: checkError } = await supabase
      .from('details_directeurs_scolaire')
      .select('id, directeur_id')
      .eq('directeur_id', directeur_id)
      .single();

    let result;
    
    if (existingDetails) {
      // Mise à jour des détails existants
      const { data, error } = await supabase
        .from('details_directeurs_scolaire')
        .update({
          realisation,
          email,
          whatsapp,
          autre_contact
        })
        .eq('directeur_id', directeur_id)
        .select();

      if (error) throw error;
      result = { data, message: 'Détails mis à jour avec succès' };
    } else {
      // Générer un nouvel ID pour l'insertion
      const { data: maxId } = await supabase
        .from('details_directeurs_scolaire')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      const newId = maxId.length > 0 ? maxId[0].id + 1 : 1;

      // Insertion des nouveaux détails
      const { data, error } = await supabase
        .from('details_directeurs_scolaire')
        .insert([{
          id: newId,
          directeur_id: parseInt(directeur_id),
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
    console.error('Erreur lors de la gestion des détails du directeur:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de la gestion des détails du directeur'
    });
  }
};

module.exports = upsertDetailsDirecteur;