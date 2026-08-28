-- ============================================================
-- Ajoute les années de baptême et de confirmation (déjà présentes
-- sur details_enfants_scolaire depuis la migration 20260903) aux
-- autres tables de détails qui suivent les sacrements : enfants
-- vacance, animateurs scolaire et animateurs vacance.
--
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

ALTER TABLE details_enfant_vacance ADD COLUMN IF NOT EXISTS annee_bapteme text;
ALTER TABLE details_enfant_vacance ADD COLUMN IF NOT EXISTS annee_confirmation text;

ALTER TABLE details_animateurs_scolaire ADD COLUMN IF NOT EXISTS annee_bapteme text;
ALTER TABLE details_animateurs_scolaire ADD COLUMN IF NOT EXISTS annee_confirmation text;

ALTER TABLE details_vacance_animateur ADD COLUMN IF NOT EXISTS annee_bapteme text;
ALTER TABLE details_vacance_animateur ADD COLUMN IF NOT EXISTS annee_confirmation text;

NOTIFY pgrst, 'reload schema';
