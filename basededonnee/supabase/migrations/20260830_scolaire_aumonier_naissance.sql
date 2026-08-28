-- ============================================================
-- La table scolaire_aumonier n'avait pas de colonne "naissance",
-- contrairement à ses tables soeurs (scolaire_directeur,
-- vacance_aumonier, vacance_directeur) qui l'ont toutes. Le
-- formulaire d'ajout envoie pourtant ce champ, ce qui faisait
-- échouer POST /api/aumoniers avec :
-- "Could not find the 'naissance' column of 'scolaire_aumonier'
-- in the schema cache"
--
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

ALTER TABLE scolaire_aumonier ADD COLUMN IF NOT EXISTS naissance text;

NOTIFY pgrst, 'reload schema';
