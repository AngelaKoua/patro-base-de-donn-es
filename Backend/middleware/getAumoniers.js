const supabase = require('../config/supabase');

const getAumoniers = async (req, res) => {
  try {
    const { annee, nom, prenom, fonction } = req.query;

    // Créer la requête de base
    let query = supabase
      .from('scolaire_aumonier')
      .select('*')
      .order('annee', { ascending: false });

    // Ajouter les filtres si nécessaire
    if (annee) {
      query = query.eq('annee', parseInt(annee));
    }
    if (nom) {
      query = query.ilike('nom', `%${nom}%`);
    }
    if (prenom) {
      query = query.ilike('prenom', `%${prenom}%`);
    }
    if (fonction) {
      query = query.ilike('fonction', `%${fonction}%`);
    }

    // Exécuter la requête
    const { data: aumoniers, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      aumoniers: aumoniers
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des aumôniers:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des aumôniers'
    });
  }
};

module.exports = getAumoniers;