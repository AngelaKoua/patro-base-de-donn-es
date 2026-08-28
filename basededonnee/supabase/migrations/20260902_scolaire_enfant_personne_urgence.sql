-- ============================================================
-- Ajoute le champ "personne à joindre en cas d'urgence" à la
-- fiche détails de l'enfant (onglet scolaire), pour aligner ses
-- champs sur ceux de la page détail vacance (qui a déjà
-- personne_urgence sur details_enfant_vacance).
--
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

ALTER TABLE details_enfants_scolaire ADD COLUMN IF NOT EXISTS personne_urgence text;

NOTIFY pgrst, 'reload schema';
