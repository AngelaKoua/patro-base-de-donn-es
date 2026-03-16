
const supabase = require('../config/supabase');

const ajouterEnfantVacance = async (req, res) => {
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
    } = req.body;

    // Validation des champs requis
    if (!annee || !numero_inscription || !nom || !prenom || !naissance || !section || !sexe) {
      return res.status(400).json({
        success: false,
        message: 'Les champs annee, numero_inscription, nom, prenom, naissance, section et sexe sont requis.'
      });
    }

    // Validation du format de la date
    const dateNaissance = new Date(naissance);
    if (isNaN(dateNaissance.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Le format de la date de naissance est invalide'
      });
    }

    // Validation du sexe
    if (!['M', 'F'].includes(sexe.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Le sexe doit être "M" ou "F"'
      });
    }

    // Générer un nouvel ID
    const { data: maxId } = await supabase
      .from('enfants_vacance')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    const newId = maxId.length > 0 ? maxId[0].id + 1 : 1;

    // Insérer le nouvel enfant
    const { data, error } = await supabase
      .from('enfants_vacance')
      .insert([
        {
          id: newId,
          annee: parseInt(annee),
          numero_inscription,
          nom,
          prenom,
          naissance: dateNaissance.toISOString().split('T')[0],
          section,
          sexe: sexe.toUpperCase(),
          religion,
          classe
        }
      ])
      .select();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Enfant ajouté avec succès',
      enfant: data[0]
    });
  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'enfant:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de l\'ajout de l\'enfant'
    });
  }
};

module.exports = ajouterEnfantVacance;