const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  try {
    console.log('Récupération des événements de vacances');
    
    const { data, error } = await supabase
      .from('evenement_vacance')
      .select('*')
      .order('date_debut', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la récupération des événements',
        error: error.message 
      });
    }

    console.log(`${data.length} événements récupérés`);
    res.json({ 
      success: true, 
      evenements: data 
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération des événements',
      error: err.message 
    });
  }
};