const supabase = require('../config/supabase');

const ajoutAnimateur = async (req, res) => {
  console.log('Données reçues:', req.body);
  const { annee, nom, prenom, fonction, date_naissance, sexe, section, religion } = req.body;

  // Formatage de la date de naissance
  let formattedDate = null;
  if (date_naissance) {
    formattedDate = new Date(date_naissance).toISOString().split('T')[0];
    console.log('Date formatée:', formattedDate);
  }
  
  console.log('Données à insérer:', {
    annee,
    nom,
    prenom,
    fonction,
    date_naissance: formattedDate,
    sexe,
    section,
    religion
  });

  try {
    const { data, error } = await supabase
      .from('scolaire_animateur')
      .insert([{
        annee,
        nom,
        prenom,
        fonction,
        date_naissance: formattedDate,
        sexe,
        section,
        religion
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }
    
    console.log('Données insérées:', data);

    res.json({
      success: true,
      message: 'Animateur ajouté avec succès',
      animateurId: data.id
    });
  } catch (err) {
    console.error('Error adding animateur:', err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de l'animateur"
    });
  }
};

module.exports = ajoutAnimateur;