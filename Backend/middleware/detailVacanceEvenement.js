const db = require('../config/database');

module.exports = (req, res) => {
  const { evenement_id, lieu, description, objectif,
    nb_patronnes_attendus, nb_patronnes_presents, taux_participation_patronnes,
    nb_animateurs_attendus, nb_animateurs_presents, taux_participation_animateurs,
    partenaires, autres_personnes_ressources, financement,
    aspects_positifs, aspects_negatifs, suggestions,
    photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10, video
  } = req.body;

  if (!evenement_id) {
    return res.status(400).json({ success: false, error: "evenement_id obligatoire" });
  }

  db.query(
    "SELECT id FROM detail_vacance_evenement WHERE evenement_id = ?",
    [evenement_id],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, error: err });

      if (rows.length > 0) {
        db.query(
          `UPDATE detail_vacance_evenement SET
            lieu=?, description=?, objectif=?,
            nb_patronnes_attendus=?, nb_patronnes_presents=?, taux_participation_patronnes=?,
            nb_animateurs_attendus=?, nb_animateurs_presents=?, taux_participation_animateurs=?,
            partenaires=?, autres_personnes_ressources=?, financement=?,
            aspects_positifs=?, aspects_negatifs=?, suggestions=?,
            photo1=?, photo2=?, photo3=?, photo4=?, photo5=?, photo6=?, photo7=?, photo8=?, photo9=?, photo10=?, video=?
          WHERE evenement_id=?`,
          [
            lieu, description, objectif,
            nb_patronnes_attendus, nb_patronnes_presents, taux_participation_patronnes,
            nb_animateurs_attendus, nb_animateurs_presents, taux_participation_animateurs,
            partenaires, autres_personnes_ressources, financement,
            aspects_positifs, aspects_negatifs, suggestions,
            photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10, video,
            evenement_id
          ],
          (err2) => {
            if (err2) return res.status(500).json({ success: false, error: err2 });
            res.json({ success: true, message: "Détails mis à jour" });
          }
        );
      } else {
        db.query(
          `INSERT INTO detail_vacance_evenement (
            evenement_id, lieu, description, objectif,
            nb_patronnes_attendus, nb_patronnes_presents, taux_participation_patronnes,
            nb_animateurs_attendus, nb_animateurs_presents, taux_participation_animateurs,
            partenaires, autres_personnes_ressources, financement,
            aspects_positifs, aspects_negatifs, suggestions,
            photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10, video
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            evenement_id, lieu, description, objectif,
            nb_patronnes_attendus, nb_patronnes_presents, taux_participation_patronnes,
            nb_animateurs_attendus, nb_animateurs_presents, taux_participation_animateurs,
            partenaires, autres_personnes_ressources, financement,
            aspects_positifs, aspects_negatifs, suggestions,
            photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10, video
          ],
          (err3) => {
            if (err3) return res.status(500).json({ success: false, error: err3 });
            res.json({ success: true, message: "Détails ajoutés" });
          }
        );
      }
    }
  );
};