const supabase = require('../config/supabase');

const addAumonier = async (req, res) => {
  const { annee, nom, prenom, fonction } = req.body;

  try {
    // Validation des données
    if (!annee || !nom || !prenom || !fonction) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis (annee, nom, prenom, fonction)'
      });
    }

    // Générer un nouvel ID
    const { data: maxId } = await supabase
      .from('scolaire_aumonier')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    const newId = maxId.length > 0 ? maxId[0].id + 1 : 1;

    // Insérer le nouvel aumônier
    const { data, error } = await supabase
      .from('scolaire_aumonier')
      .insert([
        {
          id: newId,
          annee: parseInt(annee),
          nom,
          prenom,
          fonction
        }
      ])
      .select();

    if (error) throw error;

    res.json({
      success: true,
      aumonierId: data[0].id,
      message: 'Aumônier ajouté avec succès',
      aumonier: data[0]
    });
  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'aumônier:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de l\'ajout de l\'aumônier'
    });
  }
};

module.exports = addAumonier;