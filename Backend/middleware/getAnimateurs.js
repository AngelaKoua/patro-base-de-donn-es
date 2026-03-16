const supabase = require('../config/supabase');

const getAnimateurs = async (req, res) => {
  try {
    const { data: animateurs, error } = await supabase
      .from('scolaire_animateur')
      .select('id, annee, nom, prenom, fonction, date_naissance, sexe, section, religion')
      .order('annee', { ascending: false });

    if (error) throw error;

    // Formater les dates pour chaque animateur
    const formattedAnimateurs = animateurs.map(animateur => ({
      ...animateur,
      date_naissance: animateur.date_naissance ? new Date(animateur.date_naissance).toISOString().split('T')[0] : null
    }));

    res.json({
      success: true,
      animateurs: formattedAnimateurs
    });
  } catch (err) {
    console.error('Error fetching animateurs:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des animateurs'
    });
  }
};

module.exports = getAnimateurs;