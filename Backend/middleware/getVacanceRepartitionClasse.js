// Backend/middleware/getVacanceRepartitionClasse.js
const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  const { annee } = req.query;

  if (!annee) {
    return res.status(400).json({
      success: false,
      message: "L'année est requise"
    });
  }

  try {
    // Get all students with their classes from the specified year
    const { data: enfants, error } = await supabase
      .from('enfants_vacance')
      .select('id, annee, classe')
      .eq('annee', annee);

    if (error) {
      console.error('Error fetching participants:', error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des données",
        error: error.message
      });
    }

    // Check if we have any participants
    if (!enfants || enfants.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Filter valid entries with classe
    const validEnfants = (enfants || []).filter(e => e && e.classe);

    // Calculer la répartition par classe
    const repartition = validEnfants.reduce((acc, enfant) => {
      try {
        const classe = enfant.classe ? enfant.classe.trim() : ''; // Normalize class names
        if (classe) {
          acc[classe] = (acc[classe] || 0) + 1;
        }
      } catch (err) {
        console.error('Error processing enfant:', enfant, err);
      }
      return acc;
    }, {});

    // Sort classes alphabetically and prepare data
    const classData = Object.entries(repartition)
      .map(([classe, count]) => ({
        section: classe,  // Changed from classe to section to match frontend
        count: count || 0
      }))
      .filter(item => item.section && item.count > 0) // Remove empty classes
      .sort((a, b) => a.section.localeCompare(b.section));

    // Prepare response
    const response = {
      success: true,
      data: classData  // Send the array directly as data to match frontend expectation
    };

    console.log('Répartition par classe response:', response);

    res.json(response);

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: err.message
    });
  }
};