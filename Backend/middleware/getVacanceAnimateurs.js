const supabase = require('../config/supabase');

const getVacanceAnimateurs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vacance_animateur')
      .select(`
        *,
        details:details_vacance_animateur(
          est_catechumene,
          est_bapteme,
          est_premiere_communion,
          est_confirmation,
          email,
          contact_whatsapp,
          autre_contact,
          religion,
          realisation,
          communaute
        )
      `)
      .order('nom');

    if (error) throw error;

    // Restructurer les données pour inclure les détails
    const animateursWithDetails = data.map(animateur => ({
      ...animateur,
      details: animateur.details?.[0] || null
    }));

    res.json({
      success: true,
      animateurs: animateursWithDetails
    });
  } catch (err) {
    console.error('Erreur dans getVacanceAnimateurs:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de la récupération des animateurs'
    });
  }
};

module.exports = getVacanceAnimateurs;