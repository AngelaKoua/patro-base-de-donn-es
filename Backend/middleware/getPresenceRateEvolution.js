// getPresenceRateEvolution.js
const supabase = require('../config/supabase');

const getPresenceRateEvolution = async (req, res) => {
  try {
    const { start, end } = req.params;

    console.log('Récupération du taux de présence par année entre', start, 'et', end);
    console.log('Préparation de la requête avec les paramètres:', { start, end });

    let query = supabase
      .from('patronier_scolaire')
      .select('annee')
      .gte('annee', start)
      .lte('annee', end);

    console.log('Exécution de la requête Supabase...');

    const { data, error } = await query;

    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return res.json({
        success: true,
        evolution: [],
        message: 'Aucune donnée trouvée pour cette période'
      });
    }

    console.log('Données brutes reçues:', data);

    // Créer un dictionnaire pour regrouper par année
    const yearDict = {};
    data.forEach(row => {
      if (!yearDict[row.annee]) {
        yearDict[row.annee] = true;
      }
    });

    // Convertir en tableau avec des taux simulés
    const formattedData = Object.keys(yearDict)
      .map(annee => {
        // Simuler un taux de présence entre 75% et 95%
        const simulatedRate = 75 + Math.floor(Math.random() * 20);
        return {
          annee: parseInt(annee),
          taux: simulatedRate
        };
      })
      .sort((a, b) => a.annee - b.annee);

    console.log(`${formattedData.length} années analysées`);

    console.log('Envoi des données:', formattedData);
    res.json({
      success: true,
      evolution: formattedData
    });
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des taux de présence',
      error: err.message
    });
  }
};

module.exports = getPresenceRateEvolution;