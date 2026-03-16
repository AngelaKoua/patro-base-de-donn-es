const supabase = require('../config/supabase');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const uploadPhotoAnimateur = async (req, res) => {
  try {
    const { animateur_id } = req.body;
    const file = req.file;

    if (!file || !animateur_id) {
      return res.status(400).json({ 
        success: false, 
        message: "Fichier ou ID de l'animateur manquant" 
      });
    }

    // Lire le fichier et le convertir en base64
    const fileBuffer = await readFile(file.path);
    const photo_base64 = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;

    // Vérifier si une photo existe déjà pour cet animateur
    const { data: existingPhoto, error: selectError } = await supabase
      .from('photo_animateur_scolaire')
      .select('id')
      .eq('animateur_id', animateur_id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') throw selectError;

    let result;
    if (existingPhoto) {
      // Mettre à jour la photo existante
      result = await supabase
        .from('photo_animateur_scolaire')
        .update({ photo_base64 })
        .eq('animateur_id', animateur_id)
        .select()
        .single();
    } else {
      // Insérer une nouvelle photo
      result = await supabase
        .from('photo_animateur_scolaire')
        .insert({ animateur_id, photo_base64 })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    // Nettoyer le fichier temporaire
    fs.unlink(file.path, (err) => {
      if (err) console.error('Erreur lors de la suppression du fichier temporaire:', err);
    });

    return res.json({
      success: true,
      message: existingPhoto ? 'Photo mise à jour' : 'Photo ajoutée',
      photo: result.data
    });
  } catch (error) {
    console.error('Erreur lors du traitement de la photo:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors du traitement de la photo'
    });
  }
};

module.exports = uploadPhotoAnimateur;

module.exports = uploadPhotoAnimateur;