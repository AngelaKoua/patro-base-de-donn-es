// Backend/middleware/getVacanceEvolution.js
const supabase = require('../config/supabase');

const getVacanceEvolution = async (req, res) => {
    try {
        const { startYear, endYear } = req.params;

        console.log('Récupération de l\'évolution des effectifs entre', startYear, 'et', endYear);

        if (!startYear || !endYear) {
            return res.status(400).json({
                success: false,
                message: 'Les années de début et de fin sont requises'
            });
        }

        let query = supabase
            .from('enfants_vacance')
            .select('annee, sexe')
            .gte('annee', startYear)
            .lte('annee', endYear);

        const { data, error } = await query;

        if (error) {
            console.error('Erreur Supabase:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            return res.json({
                success: true,
                evolution: [],
                message: 'Aucune donnée trouvée pour cette période'
            });
        }

        console.log('Données brutes reçues:', data);

        // Créer un dictionnaire pour regrouper par année
        const yearDict = {};
        data.forEach(row => {
            if (!yearDict[row.annee]) {
                yearDict[row.annee] = {
                    total: 0,
                    filles: 0,
                    garcons: 0
                };
            }
            yearDict[row.annee].total++;

            const sexe = row.sexe ? row.sexe.trim().toUpperCase() : '';
            if (sexe === 'F') yearDict[row.annee].filles++;
            if (sexe === 'M') yearDict[row.annee].garcons++;
        });

        // Convertir en tableau
        const formattedData = Object.keys(yearDict)
            .map(annee => ({
                annee: parseInt(annee),
                total: yearDict[annee].total,
                filles: yearDict[annee].filles,
                garcons: yearDict[annee].garcons
            }))
            .sort((a, b) => a.annee - b.annee);

        console.log(`${formattedData.length} années analysées`);

        res.json({
            success: true,
            evolution: formattedData
        });
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'évolution des effectifs',
            error: err.message
        });
    }
};

module.exports = getVacanceEvolution;