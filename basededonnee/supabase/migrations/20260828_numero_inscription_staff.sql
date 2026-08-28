-- ============================================================
-- Étend le numéro d'inscription (déjà en place pour les enfants,
-- cf. 20260819_unique_numero_inscription.sql) aux animateurs,
-- directeurs et aumôniers, scolaire et vacances.
--
-- Même principe : colonne texte, calculée côté serveur
-- (MAX(numero_inscription) + 1 par année) dans
-- src/lib/next-numero.ts, avec une contrainte d'unicité
-- (annee, numero_inscription) comme filet de sécurité contre les
-- créations concurrentes.
--
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

ALTER TABLE scolaire_animateur ADD COLUMN IF NOT EXISTS numero_inscription text;
ALTER TABLE vacance_animateur ADD COLUMN IF NOT EXISTS numero_inscription text;
ALTER TABLE scolaire_directeur ADD COLUMN IF NOT EXISTS numero_inscription text;
ALTER TABLE vacance_directeur ADD COLUMN IF NOT EXISTS numero_inscription text;
ALTER TABLE scolaire_aumonier ADD COLUMN IF NOT EXISTS numero_inscription text;
ALTER TABLE vacance_aumonier ADD COLUMN IF NOT EXISTS numero_inscription text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'scolaire_animateur_annee_numero_unique') THEN
    ALTER TABLE scolaire_animateur ADD CONSTRAINT scolaire_animateur_annee_numero_unique UNIQUE (annee, numero_inscription);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vacance_animateur_annee_numero_unique') THEN
    ALTER TABLE vacance_animateur ADD CONSTRAINT vacance_animateur_annee_numero_unique UNIQUE (annee, numero_inscription);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'scolaire_directeur_annee_numero_unique') THEN
    ALTER TABLE scolaire_directeur ADD CONSTRAINT scolaire_directeur_annee_numero_unique UNIQUE (annee, numero_inscription);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vacance_directeur_annee_numero_unique') THEN
    ALTER TABLE vacance_directeur ADD CONSTRAINT vacance_directeur_annee_numero_unique UNIQUE (annee, numero_inscription);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'scolaire_aumonier_annee_numero_unique') THEN
    ALTER TABLE scolaire_aumonier ADD CONSTRAINT scolaire_aumonier_annee_numero_unique UNIQUE (annee, numero_inscription);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vacance_aumonier_annee_numero_unique') THEN
    ALTER TABLE vacance_aumonier ADD CONSTRAINT vacance_aumonier_annee_numero_unique UNIQUE (annee, numero_inscription);
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
