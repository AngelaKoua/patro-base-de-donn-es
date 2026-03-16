// getRepartitionClasses.js
const supabase = require('../config/supabase');

const getRepartitionSexe = async (req, res) => {
  try {
    const { annee } = req.query;
    console.log('Récupération de la répartition par sexe pour l\'année:', annee);

    let query = supabase
      .from('patronier_scolaire')
      .select('sexe');

    if (annee) {
      query = query.eq('annee', annee);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return res.json({
        success: true,
        data: [
          { sexe: 'F', count: 0 },
          { sexe: 'M', count: 0 }
        ],
        message: 'Aucun enfant trouvé'
      });
    }

    // Comptage par sexe
    const sexes = { F: 0, M: 0 };
    data.forEach(row => {
      if (row.sexe) {
        const normalizedSexe = row.sexe.trim().toUpperCase();
        if (normalizedSexe === 'F' || normalizedSexe === 'M') {
          sexes[normalizedSexe]++;
        }
      }
    });

    console.log(`Total d'enfants: ${data.length} (F: ${sexes.F}, M: ${sexes.M})`);

    res.json({
      success: true,
      data: [
        { sexe: 'F', count: sexes.F, label: 'Filles' },
        { sexe: 'M', count: sexes.M, label: 'Garçons' }
      ]
    });
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la répartition par sexe',
      error: err.message
    });
  }
};

module.exports = getRepartitionSexe;