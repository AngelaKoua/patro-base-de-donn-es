const upload = require('../config/multer');
const fs = require('fs');
const path = require('path');
const supabase = require('../db');

const uploadPhotoVacanceEvenement = async (req, res) => {
  try {
    upload.single('photo')(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const { evenementId } = req.body;
      if (!evenementId) {
        return res.status(400).json({ success: false, message: 'Event ID is required' });
      }

      // Upload to Supabase Storage
      const fileStream = fs.createReadStream(req.file.path);
      const { data, error } = await supabase.storage
        .from('vacance-evenements')
        .upload(`photos/${evenementId}/${req.file.filename}`, fileStream);

      if (error) {
        // Clean up local file
        fs.unlinkSync(req.file.path);
        throw error;
      }

      // Update event with photo URL
      const photoUrl = supabase.storage
        .from('vacance-evenements')
        .getPublicUrl(`photos/${evenementId}/${req.file.filename}`).data.publicUrl;

      const { error: updateError } = await supabase
        .from('vacance_evenement')
        .update({ photo_url: photoUrl })
        .eq('id', evenementId);

      if (updateError) throw updateError;

      // Clean up local file
      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        data: {
          filename: req.file.filename,
          photoUrl
        }
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = uploadPhotoVacanceEvenement;