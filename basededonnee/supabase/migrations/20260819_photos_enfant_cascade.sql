-- ============================================================
-- Cascade de suppression manquante : photos des enfants scolaires
--
-- Constat (reproduit en direct) : supprimer un enfant dans
-- patronier_scolaire échoue avec une erreur 500 dès qu'il a une
-- photo, car la contrainte photos_enfant_id_fkey n'a pas de
-- ON DELETE CASCADE (contrairement à celle des enfants vacances,
-- qui elle l'a déjà). Postgres ne permet pas de modifier le
-- comportement ON DELETE d'une contrainte existante : il faut la
-- supprimer et la recréer.
--
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

ALTER TABLE photos DROP CONSTRAINT IF EXISTS photos_enfant_id_fkey;

ALTER TABLE photos
  ADD CONSTRAINT photos_enfant_id_fkey
  FOREIGN KEY (enfant_id) REFERENCES patronier_scolaire(id)
  ON DELETE CASCADE;

NOTIFY pgrst, 'reload schema';
