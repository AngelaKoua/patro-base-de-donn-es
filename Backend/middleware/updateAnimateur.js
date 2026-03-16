const supabase = require('../config/supabase');

const updateAnimateur = async (req, res) => {
  const id = req.params.id;
  const { annee, nom, prenom, fonction, date_naissance, sexe, section, religion } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID de l'animateur non fourni"
    });
  }

  try {
    const { data, error } = await supabase
      .from('scolaire_animateur')
      .update({
        annee,
        nom,
        prenom,
        fonction,
        date_naissance,
        sexe,
        section,
        religion
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Animateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Animateur mis à jour avec succès',
      animateur: data
    });
  } catch (err) {
    console.error('Error updating animator:', err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'animateur"
    });
  }
};

module.exports = updateAnimateur;