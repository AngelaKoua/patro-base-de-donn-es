const supabase = require('../config/supabase');

const addDirecteur = async (req, res) => {
  const { annee, nom, prenom, fonction, naissance } = req.body;
  
  try {
    // Générer un nouvel ID (vous pouvez ajuster la logique selon vos besoins)
    const { data: maxId } = await supabase
      .from('scolaire_directeur')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
    
    const newId = maxId.length > 0 ? maxId[0].id + 1 : 1;

    // Insérer le nouveau directeur
    const { data, error } = await supabase
      .from('scolaire_directeur')
      .insert([
        {
          id: newId,
          annee: parseInt(annee),
          nom,
          prenom,
          fonction,
          naissance: new Date(naissance).toISOString().split('T')[0]
        }
      ])
      .select();

    if (error) throw error;

    res.json({ 
      success: true, 
      directeurId: data[0].id,
      message: 'Directeur ajouté avec succès' 
    });
  } catch (err) {
    console.error('Erreur lors de l\'ajout du directeur:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Erreur lors de l\'ajout du directeur' 
    });
  }
};

module.exports = addDirecteur;