-- ============================================================
-- Numérotation automatique des inscriptions (scolaire + vacances)
--
-- Le numéro d'inscription est désormais calculé automatiquement
-- côté serveur (MAX(numero_inscription) + 1 par année) dans
-- src/lib/next-numero.ts, utilisé par :
--   - src/app/api/ajouter-enfant/route.ts
--   - src/app/api/ajouter-enfant-vacance/route.ts
--
-- Cette migration ajoute le filet de sécurité manquant au niveau
-- base de données : une contrainte d'unicité sur (annee,
-- numero_inscription), pour empêcher tout doublon même en cas de
-- deux créations strictement simultanées (fenêtre de course que le
-- calcul applicatif seul ne couvre pas).
--
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'patronier_scolaire_annee_numero_unique'
  ) THEN
    ALTER TABLE patronier_scolaire
      ADD CONSTRAINT patronier_scolaire_annee_numero_unique UNIQUE (annee, numero_inscription);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'enfants_vacance_annee_numero_unique'
  ) THEN
    ALTER TABLE enfants_vacance
      ADD CONSTRAINT enfants_vacance_annee_numero_unique UNIQUE (annee, numero_inscription);
  END IF;
END $$;

-- Recharge le cache de schéma PostgREST pour que Supabase prenne
-- immédiatement en compte les nouvelles contraintes.
NOTIFY pgrst, 'reload schema';
