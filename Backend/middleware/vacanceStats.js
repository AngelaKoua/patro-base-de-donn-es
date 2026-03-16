// Backend/middleware/vacanceStats.js
const supabase = require('../db');

// Années disponibles pour les enfants vacances
const getVacanceAnnees = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('enfants_vacance')
      .select('annee')
      .order('annee', { ascending: false });

    if (error) throw error;

    const annees = [...new Set(data.map(row => row.annee))];
    res.json({ success: true, annees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Répartition par section pour une année donnée
const getVacanceRepartitionSection = async (req, res) => {
  try {
    const { annee } = req.query;
    if (!annee) return res.status(400).json({ success: false, message: 'Année requise' });

    const { data, error } = await supabase
      .from('enfants_vacance')
      .select('section')
      .eq('annee', annee);

    if (error) throw error;

    const sectionCounts = data.reduce((acc, curr) => {
      acc[curr.section] = (acc[curr.section] || 0) + 1;
      return acc;
    }, {});

    const formattedData = Object.entries(sectionCounts).map(([section, count]) => ({
      section,
      count
    }));

    res.json({ success: true, data: formattedData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Répartition par sexe pour une année donnée
const getVacanceRepartitionSexe = async (req, res) => {
  try {
    const { annee } = req.query;
    if (!annee) return res.status(400).json({ success: false, message: 'Année requise' });

    const { data, error } = await supabase
      .from('enfants_vacance')
      .select('sexe')
      .eq('annee', annee)
      .or('sexe.eq.F,sexe.eq.M');

    if (error) throw error;

    const sexes = { F: 0, M: 0 };
    data.forEach(row => {
      const normalizedSexe = row.sexe.trim().toUpperCase();
      if (normalizedSexe === 'F' || normalizedSexe === 'M') {
        sexes[normalizedSexe]++;
      }
    });

    res.json({
      success: true,
      data: [
        { sexe: 'F', count: sexes.F },
        { sexe: 'M', count: sexes.M }
      ]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Histogramme taux de présence par section pour une année
const getVacancePresenceRateSection = async (req, res) => {
  try {
    const { annee } = req.query;
    if (!annee) return res.status(400).json({ success: false, message: 'Année requise' });

    console.log('Fetching presence rate for year:', annee);

    // 1. Récupérer les enfants de l'année
    const { data: enfants, error: enfantsError } = await supabase
      .from('enfants_vacance')
      .select('id, section')
      .eq('annee', annee);

    if (enfantsError) {
      console.error('Error fetching enfants:', enfantsError);
      throw enfantsError;
    }

    if (!enfants || enfants.length === 0) {
      return res.json({ success: true, data: [] });
    }

    console.log('Found enfants:', enfants.length);

    // 2. Récupérer les détails de présence pour ces enfants
    const enfantIds = enfants.map(e => e.id);
    const { data: details, error: detailsError } = await supabase
      .from('details_enfant_vacance')
      .select('enfant_id, nombre_presence, nombre_presence_totale')
      .in('enfant_id', enfantIds);

    if (detailsError) {
      console.error('Error fetching details:', detailsError);
      throw detailsError;
    }

    console.log('Found details:', details?.length || 0);

    // 3. Créer un map des détails par enfant_id
    const detailsMap = {};
    if (details) {
      details.forEach(detail => {
        detailsMap[detail.enfant_id] = detail;
      });
    }

    // 4. Grouper par section et calculer les taux
    const sectionRates = {};
    enfants.forEach(enfant => {
      const section = enfant.section || 'Non défini';
      if (!sectionRates[section]) {
        sectionRates[section] = {
          totalRate: 0,
          count: 0
        };
      }

      const detail = detailsMap[enfant.id];
      if (detail && detail.nombre_presence_totale > 0) {
        const rate = detail.nombre_presence / detail.nombre_presence_totale;
        sectionRates[section].totalRate += rate;
        sectionRates[section].count++;
      }
    });

    // 5. Calculer le taux moyen par section
    const formattedData = Object.entries(sectionRates)
      .map(([section, data]) => ({
        section,
        taux: data.count > 0 ? Number(((data.totalRate / data.count) * 100).toFixed(2)) : 0,
        count: data.count
      }))
      .filter(item => item.count > 0); // Ne garder que les sections avec des données

    console.log('Formatted data:', formattedData);

    res.json({ success: true, data: formattedData });
  } catch (err) {
    console.error('Error in getVacancePresenceRateSection:', err);
    res.status(500).json({
      success: false,
      message: err.message,
      error: err.toString()
    });
  }
};

// Évolution des effectifs (total, filles, garçons) entre deux années
const getVacanceEvolution = async (req, res) => {
  try {
    const { startYear, endYear } = req.params;
    if (!startYear || !endYear) return res.status(400).json({ success: false, message: 'Années requises' });

    const { data, error } = await supabase
      .from('enfants_vacance')
      .select('annee,sexe')
      .gte('annee', startYear)
      .lte('annee', endYear);

    if (error) throw error;

    const evolution = {};
    const validData = data || [];

    validData.forEach(row => {
      if (row && row.annee != null) {
        if (!evolution[row.annee]) {
          evolution[row.annee] = { total: 0, filles: 0, garcons: 0 };
        }
        evolution[row.annee].total++;

        if (row.sexe) {
          const sexe = row.sexe.trim().toUpperCase();
          if (sexe === 'F') evolution[row.annee].filles++;
          if (sexe === 'M') evolution[row.annee].garcons++;
        }
      }
    });

    const formattedEvolution = Object.entries(evolution)
      .map(([annee, stats]) => ({
        annee: Number(annee) || 0,
        total: stats.total || 0,
        filles: stats.filles || 0,
        garcons: stats.garcons || 0
      }))
      .filter(entry => entry.annee > 0)
      .sort((a, b) => a.annee - b.annee);

    return res.json({
      success: true,
      data: {
        evolution: formattedEvolution,
        labels: formattedEvolution.map(d => d.annee.toString()),
        total: formattedEvolution.map(d => d.total),
        filles: formattedEvolution.map(d => d.filles),
        garcons: formattedEvolution.map(d => d.garcons)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Évolution du taux global de présence par année (avec plage)
const getVacancePresenceRateEvolution = async (req, res) => {
  try {
    const { start, end } = req.params;

    console.log('Fetching presence rate evolution:', start, end);

    // 1. Récupérer les enfants pour la période
    let query = supabase
      .from('enfants_vacance')
      .select('id, annee');

    if (start && end) {
      query = query.gte('annee', start).lte('annee', end);
    }

    const { data: enfants, error: enfantsError } = await query;

    if (enfantsError) throw enfantsError;

    if (!enfants || enfants.length === 0) {
      return res.json({ success: true, data: [] });
    }

    console.log('Found enfants:', enfants.length);

    // 2. Récupérer les détails de présence
    const enfantIds = enfants.map(e => e.id);
    const { data: details, error: detailsError } = await supabase
      .from('details_enfant_vacance')
      .select('enfant_id, nombre_presence, nombre_presence_totale')
      .in('enfant_id', enfantIds);

    if (detailsError) throw detailsError;

    console.log('Found details:', details?.length || 0);

    // 3. Créer un map des détails par enfant_id
    const detailsMap = {};
    if (details) {
      details.forEach(detail => {
        detailsMap[detail.enfant_id] = detail;
      });
    }

    // 4. Grouper par année et calculer les taux
    const yearlyRates = {};
    enfants.forEach(enfant => {
      const annee = enfant.annee;
      if (!yearlyRates[annee]) {
        yearlyRates[annee] = { totalRate: 0, count: 0 };
      }

      const detail = detailsMap[enfant.id];
      if (detail && detail.nombre_presence_totale > 0) {
        const rate = detail.nombre_presence / detail.nombre_presence_totale;
        yearlyRates[annee].totalRate += rate;
        yearlyRates[annee].count++;
      }
    });

    // 5. Calculer le taux moyen par année
    const formattedData = Object.entries(yearlyRates)
      .map(([annee, data]) => ({
        annee: parseInt(annee),
        taux: data.count > 0 ? Number(((data.totalRate / data.count) * 100).toFixed(2)) : 0
      }))
      .sort((a, b) => a.annee - b.annee);

    console.log('Formatted data:', formattedData);

    res.json({ success: true, data: formattedData });
  } catch (err) {
    console.error('Error in getVacancePresenceRateEvolution:', err);
    res.status(500).json({
      success: false,
      message: err.message,
      error: err.toString()
    });
  }
};

module.exports = {
  getVacanceAnnees,
  getVacanceRepartitionSection,
  getVacanceRepartitionSexe,
  getVacancePresenceRateSection,
  getVacanceEvolution,
  getVacancePresenceRateEvolution
};