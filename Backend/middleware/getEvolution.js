const supabase = require('../config/supabase');

const getEvolution = async (req, res) => {
  const { startYear, endYear } = req.params;
  console.log('[getEvolution] Reçu:', { startYear, endYear });
  if (!startYear || !endYear) {
    return res.status(400).json({
      success: false,
      message: 'Années de début et de fin requises'
    });
  }
  try {
    console.log('Exécution de la requête Supabase pour l\'évolution...');
    const { data: result, error } = await supabase
      .from('patronier_scolaire')
      .select('annee, sexe')
      .gte('annee', startYear)
      .lte('annee', endYear);

    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }

    // Grouper les résultats par année
    const groupedByYear = result.reduce((acc, curr) => {
      const year = curr.annee;
      if (!acc[year]) {
        acc[year] = { total: 0, filles: 0, garcons: 0 };
      }
      acc[year].total++;
      if (curr.sexe === 'F') acc[year].filles++;
      if (curr.sexe === 'M') acc[year].garcons++;
      return acc;
    }, {});
    // Convertir les données groupées en tableau trié par année
    const evolution = Object.entries(groupedByYear)
      .map(([annee, data]) => ({
        annee: parseInt(annee),
        total: data.total,
        filles: data.filles,
        garcons: data.garcons
      }))
      .sort((a, b) => a.annee - b.annee);

    console.log('[getEvolution] Réponse:', evolution);
    res.json({
      success: true,
      evolution
    });
  } catch (err) {
    console.error('Error fetching evolution data:', err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des données d'évolution"
    });
  }
};

module.exports = getEvolution;