// getRepartitionClasses.js
const supabase = require('../config/supabase');

const getRepartitionClasses = async (req, res) => {
  try {
    const { annee } = req.query;
    console.log('Récupération de la répartition par classe pour l\'année:', annee);

    let query = supabase
      .from('patronier_scolaire')
      .select('classe');

    if (annee) {
      query = query.eq('annee', annee);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'Aucun enfant trouvé dans les classes'
      });
    }

    // Comptage des élèves par classe
    const classeCounts = data.reduce((acc, curr) => {
      if (!curr.classe) return acc; // Ignore les entrées sans classe
      acc[curr.classe] = (acc[curr.classe] || 0) + 1;
      return acc;
    }, {});

    // Formatage des données pour la réponse
    const formattedData = Object.entries(classeCounts)
      .filter(([classe]) => classe) // Filtre les classes vides
      .map(([classe, count]) => ({
        classe,
        count
      }))
      .sort((a, b) => a.classe.localeCompare(b.classe)); // Tri par classe

    console.log(`${formattedData.length} classes analysées`);

    res.json({
      success: true,
      data: formattedData
    });
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la répartition par classe',
      error: err.message
    });
  }
};

module.exports = getRepartitionClasses;