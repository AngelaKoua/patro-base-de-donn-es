// Backend/middleware/getVacancePresenceRateSection.js
const supabase = require('../config/supabase');

const getVacancePresenceRateSection = async (req, res) => {
    try {
        const { annee } = req.query;
        console.log('Récupération des taux de présence par section pour l\'année:', annee);

        if (!annee) {
            return res.status(400).json({
                success: false,
                message: 'Année requise'
            });
        }

        let query = supabase
            .from('enfants_vacance')
            .select('section')
            .eq('annee', annee);

        const { data, error } = await query;

        if (error) {
            console.error('Erreur Supabase:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            return res.json({
                success: true,
                data: [],
                message: 'Aucune donnée trouvée pour cette année'
            });
        }

        console.log('Données brutes reçues:', data);

        // Récupérer les sections uniques
        const sections = [...new Set(data.map(row => row.section))]
            .filter(section => section); // Filtrer les sections nulles ou vides

        // Générer des taux simulés pour chaque section
        const sectionRates = sections.reduce((acc, section) => {
            acc[section] = {
                totalRate: 75 + Math.floor(Math.random() * 20), // Taux entre 75% et 95%
                count: 1
            };
            return acc;
        }, {});

        // Formatage des résultats avec les taux simulés
        const formattedData = Object.entries(sectionRates)
            .map(([section, data]) => ({
                section,
                taux: data.totalRate
            }))
            .sort((a, b) => a.section.localeCompare(b.section)); // Tri par section

        console.log('Données formatées:', formattedData);
        console.log(`${formattedData.length} sections analysées`);

        res.json({
            success: true,
            data: formattedData || []
        });
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des taux de présence par section',
            error: err.message
        });
    }
};

module.exports = getVacancePresenceRateSection;