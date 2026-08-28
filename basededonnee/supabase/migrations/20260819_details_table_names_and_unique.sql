-- ============================================================
-- Fiches "détails" (enfants, directeurs, aumôniers — scolaire et
-- vacances) : onglet Détails qui échouait en 500
--
-- Deux bugs distincts, reproduits en direct :
--
-- 1) Le code interrogeait des noms de table qui n'existent pas
--    (ex: details_patronier_scolaire au lieu de
--    details_enfants_scolaire, details_vacance_directeur au lieu
--    de detail_directeur_vacance, etc). Déjà corrigé dans le code
--    (src/app/api/details-*, src/app/api/enfant/[id],
--    src/app/api/animateurs/[id], etc.) — rien à faire côté SQL
--    pour ce point.
--
-- 2) Une fois le bon nom de table utilisé, l'enregistrement des
--    détails échoue quand même avec :
--    "there is no unique or exclusion constraint matching the
--    ON CONFLICT specification"
--    Le code fait un upsert (onConflict: '<entite>_id') mais ces
--    tables n'ont pas de contrainte UNIQUE sur cette colonne.
--    Cette migration l'ajoute pour les 6 tables concernées
--    (details_animateurs_scolaire et details_vacance_animateur
--    l'ont déjà et n'ont pas besoin d'être touchées).
--
-- Vérifié : les 6 tables sont vides, donc aucun conflit possible
-- lors de l'ajout de la contrainte.
--
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'details_enfants_scolaire_enfant_id_key') THEN
    ALTER TABLE details_enfants_scolaire ADD CONSTRAINT details_enfants_scolaire_enfant_id_key UNIQUE (enfant_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'details_enfant_vacance_enfant_id_key') THEN
    ALTER TABLE details_enfant_vacance ADD CONSTRAINT details_enfant_vacance_enfant_id_key UNIQUE (enfant_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'details_directeurs_scolaire_directeur_id_key') THEN
    ALTER TABLE details_directeurs_scolaire ADD CONSTRAINT details_directeurs_scolaire_directeur_id_key UNIQUE (directeur_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'details_aumonier_scolaire_aumonier_id_key') THEN
    ALTER TABLE details_aumonier_scolaire ADD CONSTRAINT details_aumonier_scolaire_aumonier_id_key UNIQUE (aumonier_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'detail_directeur_vacance_directeur_id_key') THEN
    ALTER TABLE detail_directeur_vacance ADD CONSTRAINT detail_directeur_vacance_directeur_id_key UNIQUE (directeur_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'detail_aumonier_vacance_aumonier_id_key') THEN
    ALTER TABLE detail_aumonier_vacance ADD CONSTRAINT detail_aumonier_vacance_aumonier_id_key UNIQUE (aumonier_id);
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
