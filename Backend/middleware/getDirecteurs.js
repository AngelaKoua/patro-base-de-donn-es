const supabase = require('../config/supabase');

const getDirecteurs = async (req, res) => {
  try {
    const { annee, nom, prenom, fonction } = req.query;

    // Créer la requête de base
    let query = supabase
      .from('scolaire_directeur')
      .select('*')
      .order('annee', { ascending: false });

    // Ajouter les filtres si nécessaire
    if (annee) {
      query = query.eq('annee', annee);
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
    const { data: directeurs, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      directeurs: directeurs
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des directeurs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des directeurs'
    });
  }
};

module.exports = getDirecteurs;