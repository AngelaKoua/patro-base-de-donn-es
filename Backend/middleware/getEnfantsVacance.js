const supabase = require('../config/supabase');

const getEnfantsVacance = async (req, res) => {
  try {
    const { 
      annee, 
      numero_inscription, 
      nom, 
      prenom, 
      naissance, 
      section, 
      sexe, 
      religion, 
      classe 
    } = req.query;

    // Créer la requête de base
    let query = supabase
      .from('enfants_vacance')
      .select('*');

    // Ajouter les filtres si nécessaire
    if (annee) {
      query = query.eq('annee', parseInt(annee));
    }
    if (numero_inscription) {
      query = query.ilike('numero_inscription', `%${numero_inscription}%`);
    }
    if (nom) {
      query = query.ilike('nom', `%${nom}%`);
    }
    if (prenom) {
      query = query.ilike('prenom', `%${prenom}%`);
    }
    if (naissance) {
      query = query.eq('naissance', naissance);
    }
    if (section) {
      query = query.eq('section', section);
    }
    if (sexe) {
      query = query.eq('sexe', sexe);
    }
    if (religion) {
      query = query.eq('religion', religion);
    }
    if (classe) {
      query = query.ilike('classe', `%${classe}%`);
    }

    // Ajouter le tri
    if (annee) {
      query = query.order('numero_inscription', { ascending: true });
    } else {
      query = query
        .order('annee', { ascending: false })
        .order('numero_inscription', { ascending: true });
    }

    // Exécuter la requête
    const { data: enfants, error } = await query;

    if (error) {
      console.error('[getEnfantsVacance] Erreur Supabase:', error);
      throw error;
    }

    // Log des résultats
    console.log(`[getEnfantsVacance] ${enfants.length} enfants trouvés`);

    res.json({
      success: true,
      enfants: enfants
    });
  } catch (err) {
    console.error('[getEnfantsVacance] Erreur:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de la récupération des enfants',
      error: err.message
    });
  }
};

module.exports = getEnfantsVacance;