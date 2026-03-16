const supabase = require('../config/supabase');

const getAnneesScolaires = async (req, res) => {
  try {
    console.log('Début de la récupération des années scolaires');

    console.log('Exécution de la requête Supabase...');
    const { data, error } = await supabase
      .from('patronier_scolaire')
      .select('annee');

    if (error) {
      console.error('Erreur Supabase:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('Données brutes reçues:', data);

    if (!data || data.length === 0) {
      return res.json({ 
        success: true, 
        annees: [],
        message: 'Aucune année trouvée' 
      });
    }

    // Extraire les années uniques et les convertir en chaînes de caractères
    const annees = [...new Set(data.map(row => row.annee))]
      .filter(annee => annee != null) // Filtrer les valeurs null/undefined
      .map(annee => annee.toString()) // Convertir en chaînes de caractères
      .sort((a, b) => parseInt(b) - parseInt(a)); // Tri décroissant

    console.log(`${annees.length} années disponibles:`, annees);

    res.json({ 
      success: true, 
      annees: annees || [] // S'assurer qu'on renvoie au moins un tableau vide
    });
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des années',
      error: err.message 
    });
  }
};

module.exports = getAnneesScolaires;