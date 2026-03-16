// Backend/middleware/getVacancePresenceRateEvolution.js
const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  const { startYear, endYear } = req.params;

  if (!startYear || !endYear) {
    return res.status(400).json({
      success: false,
      message: "Les années de début et de fin sont requises"
    });
  }

  try {
    console.log('Récupération du taux de présence par année entre', startYear, 'et', endYear);

    // Récupérer les enfants pour la période
    const { data: enfants, error: enfantsError } = await supabase
      .from('enfants_vacance')
      .select('annee')
      .gte('annee', startYear)
      .lte('annee', endYear);

    if (enfantsError) {
      console.error('Error fetching enfants:', enfantsError);
      throw enfantsError;
    }

    if (!enfants || enfants.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'Aucune donnée trouvée pour cette période'
      });
    }

    console.log('Données brutes reçues:', enfants);

    // Créer un dictionnaire pour regrouper par année
    const yearDict = {};
    enfants.forEach(row => {
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
    console.log('Données formatées:', formattedData);

    res.json({
      success: true,
      data: formattedData  // ← Retourner directement l'array
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: err.message
    });
  }
};