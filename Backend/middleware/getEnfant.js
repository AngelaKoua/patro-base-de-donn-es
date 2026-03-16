const supabase = require('../config/supabase');

const getEnfant = async (req, res) => {
  const id = parseInt(req.params.id);

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  try {
    console.log('=== DEBUT getEnfant pour ID:', id, '===');

    // Récupérer les informations de base de l'enfant
    const { data: enfant, error: enfantError } = await supabase
      .from('patronier_scolaire')
      .select('*')
      .eq('id', id)
      .single();

    if (enfantError) {
      console.error('Erreur récupération enfant:', enfantError);
      throw enfantError;
    }

    if (!enfant) {
      return res.status(404).json({
        success: false,
        message: 'Patronné non trouvé'
      });
    }

    console.log('Enfant trouvé:', {
      id: enfant.id,
      nom: enfant.nom,
      prenom: enfant.prenom
    });

    // Récupérer les détails de l'enfant
    const { data: details, error: detailsError } = await supabase
      .from('details_enfants_scolaire')
      .select('*')
      .eq('enfant_id', id)
      .single();

    if (detailsError && detailsError.code !== 'PGRST116') {
      console.error('Erreur récupération détails:', detailsError);
      throw detailsError;
    }

    console.log('Détails trouvés:', !!details);

    // LOG CRITIQUE : Voir si details a un champ 'id'
    if (details) {
      console.log('⚠️ Détails contient:', Object.keys(details));
      console.log('⚠️ details.id =', details.id);
    }

    // Récupérer la photo de l'enfant
    console.log('Recherche de photo pour enfant_id:', id);

    const { data: photo, error: photoError } = await supabase
      .from('photos')
      .select('id, public_url, file_path, mime_type, updated_at, enfant_id')
      .eq('enfant_id', id)
      .maybeSingle();

    console.log('Résultat recherche photo:', {
      trouve: !!photo,
      erreur: photoError,
      id_photo: photo?.id,
      enfant_id_photo: photo?.enfant_id,
      public_url: photo?.public_url
    });

    if (photoError && photoError.code !== 'PGRST116') {
      console.error('Erreur récupération photo:', photoError);
    }

    // Ajouter un timestamp à l'URL pour éviter le cache
    let photoUrl = null;
    if (photo?.public_url) {
      const timestamp = photo.updated_at
        ? new Date(photo.updated_at).getTime()
        : Date.now();
      photoUrl = `${photo.public_url}?t=${timestamp}`;
      console.log('Photo URL générée:', photoUrl);
    } else {
      console.log('Aucune photo trouvée pour cet enfant');
    }

    // CORRECTION CRITIQUE : Supprimer l'id des détails avant de faire le spread
    let detailsSansId = null;
    if (details) {
      const { id: detailId, enfant_id, ...restDetails } = details;
      detailsSansId = restDetails;
      console.log('⚠️ ID supprimé des détails. detailId était:', detailId);
    }

    // Combiner toutes les données - IMPORTANT: enfant DOIT être en dernier pour préserver son id
    const result = {
      ...(detailsSansId || {}),
      ...enfant,  // EN DERNIER pour que enfant.id écrase tout
      photo: photoUrl,
      photo_id: photo?.id || null
    };

    console.log('=== FIN getEnfant - Réponse finale ===', {
      enfant_id: result.id,
      nom: result.nom,
      prenom: result.prenom,
      a_photo: !!result.photo,
      photo_url: result.photo
    });

    // VÉRIFICATION FINALE
    if (result.id !== id) {
      console.error('🚨 ERREUR CRITIQUE: result.id !== id demandé !', {
        id_demande: id,
        result_id: result.id,
        enfant_id: enfant.id
      });
    }

    res.json({ success: true, enfant: result });
  } catch (err) {
    console.error('Database error dans getEnfant:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: err.message
    });
  }
};

module.exports = getEnfant;