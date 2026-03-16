const supabase = require('../config/supabase');

const getRepartitionSexe = async (annee) => {
  // Get students and their gender for the specified year
  const { data, error } = await supabase
    .from('enfants_vacance')
    .select('sexe')
    .eq('annee', annee);

  if (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }

  // Initialize counts
  let garcons = 0;
  let filles = 0;

  // Count gender distribution
  (data || []).forEach(enfant => {
    if (enfant && enfant.sexe) {
      const sexe = enfant.sexe.toString().toUpperCase().trim();
      if (sexe === 'M') garcons++;
      if (sexe === 'F') filles++;
    }
  });

  return {
    labels: ['Garçons', 'Filles'],
    values: [garcons, filles],
    details: [
      { sexe: 'M', count: garcons, label: 'Garçons' },
      { sexe: 'F', count: filles, label: 'Filles' }
    ],
    garcons,
    filles,
    total: garcons + filles
  };
};

module.exports = async (req, res) => {
  const { annee } = req.query;

  if (!annee) {
    return res.status(400).json({
      success: false,
      message: "L'année est requise"
    });
  }

  try {
    // Récupérer les événements de l'année spécifiée et leurs participants
    console.log('Fetching data for year:', annee);

    // Get all students from the specified year with their gender
    const { data: enfantsVacance, error } = await supabase
      .from('enfants_vacance')
      .select('sexe')
      .eq('annee', annee);

    // Log raw data for debugging
    console.log('Query result:', {
      data: enfantsVacance?.length ? enfantsVacance : null,
      error: error || null,
      year: annee
    });

    console.log('Query result:', { data: enfantsVacance, error });

    if (error) {
      console.error('Error fetching participants:', error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des données",
        error: error.message
      });
    }

    if (!enfantsVacance || enfantsVacance.length === 0) {
      return res.json({
        success: true,
        data: {
          labels: ['Garçons', 'Filles'],
          values: [0, 0],
          details: [
            { sexe: 'M', count: 0, label: 'Garçons' },
            { sexe: 'F', count: 0, label: 'Filles' }
          ],
          garcons: 0,
          filles: 0,
          total: 0
        }
      });
    }

    // If no data found, return zeros
    if (!enfantsVacance || enfantsVacance.length === 0) {
      return res.json({
        success: true,
        data: {
          labels: ['Garçons', 'Filles'],
          values: [0, 0],
          details: [
            { sexe: 'M', count: 0, label: 'Garçons' },
            { sexe: 'F', count: 0, label: 'Filles' }
          ],
          garcons: 0,
          filles: 0,
          total: 0
        }
      });
    }

    // Process gender distribution
    const repartition = enfantsVacance.reduce((acc, enfant) => {
      if (enfant && enfant.sexe) {
        const sexe = enfant.sexe.toString().toUpperCase().trim();
        if (sexe === 'M' || sexe === 'F') {
          acc[sexe] = (acc[sexe] || 0) + 1;
        }
      }
      return acc;
    }, { M: 0, F: 0 }); // Initialize with 0 for both genders

    console.log('Gender distribution:', repartition);

    const data = {
      labels: ['Garçons', 'Filles'],
      values: [repartition.M, repartition.F],
      details: [
        { sexe: 'M', count: repartition.M, label: 'Garçons' },
        { sexe: 'F', count: repartition.F, label: 'Filles' }
      ],
      garcons: repartition.M,
      filles: repartition.F,
      total: repartition.M + repartition.F
    };

    res.json({
      success: true,
      data: data.details  // ← retourne juste l'array details
    });

  } catch (err) {
    console.error('Server error:', {
      error: err,
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({
      success: false,
      message: "Erreur lors du calcul de la répartition par sexe",
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};