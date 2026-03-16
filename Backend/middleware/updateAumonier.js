const supabase = require('../config/supabase');

const updateAumonier = async (req, res) => {
  const { annee, nom, prenom, fonction } = req.body;
  const aumonierId = parseInt(req.params.id);

  try {
    // Validation des données
    if (!annee || !nom || !prenom || !fonction) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis (annee, nom, prenom, fonction)'
      });
    }

    // Vérifier si l'aumônier existe
    const { data: existingAumonier, error: checkError } = await supabase
      .from('scolaire_aumonier')
      .select('id')
      .eq('id', aumonierId)
      .single();

    if (checkError || !existingAumonier) {
      return res.status(404).json({
        success: false,
        message: 'Aumônier non trouvé'
      });
    }

    // Mettre à jour l'aumônier
    const { data, error } = await supabase
      .from('scolaire_aumonier')
      .update({
        annee: parseInt(annee),
        nom,
        prenom,
        fonction
      })
      .eq('id', aumonierId)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Aumônier modifié avec succès',
      aumonier: data[0]
    });
  } catch (err) {
    console.error('Erreur lors de la modification de l\'aumônier:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de la modification de l\'aumônier'
    });
  }
};

module.exports = updateAumonier;