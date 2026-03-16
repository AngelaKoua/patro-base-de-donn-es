const supabase = require('../config/supabase');

const updateDirecteur = async (req, res) => {
  const { annee, nom, prenom, fonction, naissance } = req.body;
  const directeurId = parseInt(req.params.id);

  try {
    // Vérifier si le directeur existe
    const { data: existingDirecteur, error: checkError } = await supabase
      .from('scolaire_directeur')
      .select('id')
      .eq('id', directeurId)
      .single();

    if (checkError || !existingDirecteur) {
      return res.status(404).json({
        success: false,
        message: 'Directeur non trouvé'
      });
    }

    // Mettre à jour le directeur
    const { data, error } = await supabase
      .from('scolaire_directeur')
      .update({
        annee: parseInt(annee),
        nom,
        prenom,
        fonction,
        naissance: new Date(naissance).toISOString().split('T')[0]
      })
      .eq('id', directeurId)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Directeur modifié avec succès',
      directeur: data[0]
    });
  } catch (err) {
    console.error('Erreur lors de la modification du directeur:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de la modification du directeur'
    });
  }
};

module.exports = updateDirecteur;