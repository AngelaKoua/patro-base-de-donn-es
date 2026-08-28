-- ============================================================
-- POST /api/detail-evenement (et /api/detail-vacance-evenement)
-- utilisent upsert(..., { onConflict: 'evenement_id' }) pour
-- créer ou mettre à jour les détails d'un évènement. Or la colonne
-- evenement_id n'avait aucune contrainte UNIQUE, ce qui faisait
-- échouer l'upsert avec :
-- "there is no unique or exclusion constraint matching the ON
-- CONFLICT specification"
--
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'detail_evenement_scolaire_evenement_id_key'
  ) THEN
    ALTER TABLE detail_evenement_scolaire
      ADD CONSTRAINT detail_evenement_scolaire_evenement_id_key UNIQUE (evenement_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'detail_evenement_vacance_evenement_id_key'
  ) THEN
    ALTER TABLE detail_evenement_vacance
      ADD CONSTRAINT detail_evenement_vacance_evenement_id_key UNIQUE (evenement_id);
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
