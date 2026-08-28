-- ============================================================
-- La page détail Scolaire_enfant affiche une année à côté des
-- puces "1ère communion" et "Confirmation" (et prévoit aussi le
-- baptême), mais les colonnes annee_bapteme, annee_premiere_communion
-- et annee_confirmation n'ont jamais existé sur details_enfants_scolaire
-- et aucun champ de formulaire ne permettait de les renseigner —
-- l'année ne s'affichait donc jamais.
--
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

ALTER TABLE details_enfants_scolaire ADD COLUMN IF NOT EXISTS annee_bapteme text;
ALTER TABLE details_enfants_scolaire ADD COLUMN IF NOT EXISTS annee_premiere_communion text;
ALTER TABLE details_enfants_scolaire ADD COLUMN IF NOT EXISTS annee_confirmation text;

NOTIFY pgrst, 'reload schema';
