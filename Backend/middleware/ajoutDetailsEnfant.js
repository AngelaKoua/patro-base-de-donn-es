const supabase = require('../config/supabase');

const ajoutDetailsEnfant = async (req, res) => {
  const { enfant_id, ...detailsData } = req.body;
  try {
    // Check if details exist
    const { data: checkResult, error: checkError } = await supabase
      .from('details_enfants_scolaire')
      .select('*')
      .eq('enfant_id', enfant_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    // Met à jour les présences dans details_enfants_scolaire
    if (typeof detailsData.nombre_presences !== 'undefined' && typeof detailsData.nombre_presences_total !== 'undefined') {
      const presenceData = {
        nombre_presences: detailsData.nombre_presences || 0,
        nombre_presences_total: detailsData.nombre_presences_total || 0
      };

      const { error: updateError } = await supabase
        .from('details_enfants_scolaire')
        .update(presenceData)
        .eq('enfant_id', enfant_id);

      if (updateError) {
        console.warn('Could not update presence counts:', updateError);
        // Continue with the rest of the function even if this fails
      }
    }

    if (!checkResult) {
      // Insert new details
      const { data: insertResult, error: insertError } = await supabase
        .from('details_enfants_scolaire')
        .insert([{
          enfant_id,
          domicile: detailsData.domicile || null,
          quartier: detailsData.quartier || null,
          rue: detailsData.rue || null,
          lot: detailsData.lot || null,
          nom_pere: detailsData.nom_pere || null,
          profession_pere: detailsData.profession_pere || null,
          nom_mere: detailsData.nom_mere || null,
          profession_mere: detailsData.profession_mere || null,
          personne_urgence: detailsData.personne_urgence || null,
          ecole: detailsData.ecole || null,
          classe: detailsData.classe || null,
          portfolio: detailsData.portfolio || null,
          realisation: detailsData.realisation || null,
          communaute: detailsData.communaute || null,
          est_catechumene: !!detailsData.est_catechumene,
          est_bapteme: !!detailsData.est_bapteme,
          est_premiere_communion: !!detailsData.est_premiere_communion,
          est_confirmation: !!detailsData.est_confirmation,
          nom_tuteur: detailsData.nom_tuteur || null,
          prenom_tuteur: detailsData.prenom_tuteur || null,
          contact_tuteur: detailsData.contact_tuteur || null,
          nom_tutrice: detailsData.nom_tutrice || null,
          prenom_tutrice: detailsData.prenom_tutrice || null,
          contact_tutrice: detailsData.contact_tutrice || null,
          nombre_presences: detailsData.nombre_presences || 0,
          nombre_presences_total: detailsData.nombre_presences_total || 0
        }])
        .select();

      if (insertError) throw insertError;

      const insertedRecord = insertResult[0];

      // Get photo data
      const { data: photoData, error: photoError } = await supabase
        .from('photos')
        .select('file_path, mime_type')
        .eq('enfant_id', enfant_id)
        .single();
        
      if (photoError && photoError.code !== 'PGRST116') {
        console.warn('Error fetching photo:', photoError);
      }
      
      let signedUrl = null;
      if (photoData?.file_path) {
        try {
          const { data: { signedURL }, error: signError } = await supabase
            .storage
            .from('enfants')
            .createSignedUrl(photoData.file_path, 3600); // URL valid for 1 hour
          
          if (!signError) {
            signedUrl = signedURL;
          } else {
            console.warn('Error creating signed URL:', signError);
          }
        } catch (err) {
          console.warn('Error getting signed URL:', err);
        }
      }

      res.json({
        success: true,
        message: 'Détails ajoutés avec succès',
        enfant: {
          ...insertedRecord,
          ...(photoData && { 
            photo_data: photoData.buffer,
            mime_type: photoData.mimetype
          })
        }
      });
    } else {
      // Update existing details
      const { error: updateError } = await supabase
        .from('details_enfants_scolaire')
        .update({
          domicile: detailsData.domicile || null,
          quartier: detailsData.quartier || null,
          rue: detailsData.rue || null,
          lot: detailsData.lot || null,
          nom_pere: detailsData.nom_pere || null,
          profession_pere: detailsData.profession_pere || null,
          nom_mere: detailsData.nom_mere || null,
          profession_mere: detailsData.profession_mere || null,
          personne_urgence: detailsData.personne_urgence || null,
          ecole: detailsData.ecole || null,
          classe: detailsData.classe || null,
          portfolio: detailsData.portfolio || null,
          realisation: detailsData.realisation || null,
          communaute: detailsData.communaute || null,
          est_catechumene: !!detailsData.est_catechumene,
          est_bapteme: !!detailsData.est_bapteme,
          est_premiere_communion: !!detailsData.est_premiere_communion,
          est_confirmation: !!detailsData.est_confirmation,
          nom_tuteur: detailsData.nom_tuteur || null,
          prenom_tuteur: detailsData.prenom_tuteur || null,
          contact_tuteur: detailsData.contact_tuteur || null,
          nom_tutrice: detailsData.nom_tutrice || null,
          prenom_tutrice: detailsData.prenom_tutrice || null,
          contact_tutrice: detailsData.contact_tutrice || null,
          nombre_presences: detailsData.nombre_presences || 0,
          nombre_presences_total: detailsData.nombre_presences_total || 0
        })
        .eq('enfant_id', enfant_id);

      if (updateError) throw updateError;

      // Get updated data with photo
      const { data: updatedData, error: fetchError } = await supabase
        .from('details_enfants_scolaire')
        .select('*')
        .eq('enfant_id', enfant_id)
        .single();

      // Get photo data separately
      const { data: photoData, error: photoError } = await supabase
        .from('photos')
        .select('file_path, mime_type')
        .eq('enfant_id', enfant_id)
        .single();

      let signedUrl = null;
      if (photoData?.file_path) {
        try {
          const { data: { signedURL }, error: signError } = await supabase
            .storage
            .from('enfants')
            .createSignedUrl(photoData.file_path, 3600); // URL valid for 1 hour
          
          if (!signError) {
            signedUrl = signedURL;
          } else {
            console.warn('Error creating signed URL:', signError);
          }
        } catch (err) {
          console.warn('Error getting signed URL:', err);
        }
      }

      if (fetchError) throw fetchError;

      res.json({
        success: true,
        message: 'Détails mis à jour avec succès',
        enfant: {
          ...updatedData,
          ...(signedUrl && photoData && {
            photo_url: signedUrl,
            photo_path: photoData.file_path,
            mime_type: photoData.mime_type
          })
        }
      });
    }
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'ajout/mise à jour des détails',
      error: error.message
    });
  }
};

module.exports = ajoutDetailsEnfant;

module.exports = ajoutDetailsEnfant;