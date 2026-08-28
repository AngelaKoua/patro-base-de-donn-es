-- ============================================================
-- Ajoute une petite section "Famille" à la fiche détails de
-- l'animateur (scolaire et vacances) : le nom/la profession du
-- père et de la mère (même principe que la section Parents déjà
-- en place pour les enfants).
--
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

ALTER TABLE details_animateurs_scolaire ADD COLUMN IF NOT EXISTS nom_pere text;
ALTER TABLE details_animateurs_scolaire ADD COLUMN IF NOT EXISTS profession_pere text;
ALTER TABLE details_animateurs_scolaire ADD COLUMN IF NOT EXISTS nom_mere text;
ALTER TABLE details_animateurs_scolaire ADD COLUMN IF NOT EXISTS profession_mere text;

ALTER TABLE details_vacance_animateur ADD COLUMN IF NOT EXISTS nom_pere text;
ALTER TABLE details_vacance_animateur ADD COLUMN IF NOT EXISTS profession_pere text;
ALTER TABLE details_vacance_animateur ADD COLUMN IF NOT EXISTS nom_mere text;
ALTER TABLE details_vacance_animateur ADD COLUMN IF NOT EXISTS profession_mere text;

NOTIFY pgrst, 'reload schema';
