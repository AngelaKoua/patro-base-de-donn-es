const supabase = require('../config/supabase');

const upsertDetailsEnfantVacance = async (req, res) => {
  const { enfant_id, ...details } = req.body;
  
  if (!enfant_id) {
    return res.status(400).json({ 
      success: false, 
      message: "ID de l'enfant manquant" 
    });
  }

  try {
    // Convertir les valeurs booléennes de string à boolean si nécessaire
    const formattedDetails = {
      ...details,
      est_catechumene: details.est_catechumene === 'true' || details.est_catechumene === true,
      est_bapteme: details.est_bapteme === 'true' || details.est_bapteme === true,
      est_premiere_communion: details.est_premiere_communion === 'true' || details.est_premiere_communion === true,
      est_confirmation: details.est_confirmation === 'true' || details.est_confirmation === true,
      nombre_presence: details.nombre_presence ? parseInt(details.nombre_presence) : 0,
      nombre_presence_totale: details.nombre_presence_totale ? parseInt(details.nombre_presence_totale) : 0
    };

    // Vérifier si un enregistrement existe déjà
    const { data: existingRecord, error: checkError } = await supabase
      .from('details_enfant_vacance')
      .select('id')
      .eq('enfant_id', enfant_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    let result;
    
    if (existingRecord) {
      // Update
      const { data, error: updateError } = await supabase
        .from('details_enfant_vacance')
        .update(formattedDetails)
        .eq('enfant_id', enfant_id)
        .select();

      if (updateError) throw updateError;
      result = { success: true, action: 'update', data };
    } else {
      // Insert
      const { data, error: insertError } = await supabase
        .from('details_enfant_vacance')
        .insert([{ enfant_id, ...formattedDetails }])
        .select();

      if (insertError) throw insertError;
      result = { success: true, action: 'insert', data };
    }

    return res.json(result);
  } catch (err) {
    console.error('Erreur:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'opération', 
      error: err.message 
    });
  }
};

module.exports = upsertDetailsEnfantVacance;