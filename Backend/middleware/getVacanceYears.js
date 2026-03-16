// Backend/middleware/getVacanceYears.js
const supabase = require('../config/supabase');

const getVacanceYears = async (req, res) => {
  try {
    // Récupérer depuis enfants_vacance au lieu de evenement_vacance
    const { data, error } = await supabase
      .from('enfants_vacance')
      .select('annee')
      .order('annee', { ascending: false });

    if (error) {
      console.error('Error fetching vacation years:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des années de vacances',
        error: error.message
      });
    }

    // Ensure data is an array and handle null/undefined values
    const validData = data || [];

    // Extract unique years and convert to numbers
    const years = [...new Set(validData
      .filter(row => row && row.annee != null)
      .map(row => Number(row.annee))
      .filter(year => !isNaN(year))
    )].sort((a, b) => b - a);  // Sort descending

    // If no years found, provide current year as default
    if (years.length === 0) {
      years.push(new Date().getFullYear());
    }

    // Convert years to strings
    const yearStrings = years.map(year => year.toString());

    console.log('Years vacances found:', yearStrings);

    res.json({
      success: true,
      annees: yearStrings
    });
  } catch (err) {
    console.error('Server error fetching vacation years:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des années de vacances',
      error: err.message
    });
  }
};

module.exports = getVacanceYears;