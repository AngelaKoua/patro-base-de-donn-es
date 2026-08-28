-- ============================================================
-- Ajoute un contact distinct pour le père et pour la mère sur la
-- fiche détails de l'enfant (onglet vacance), en miroir de la
-- migration équivalente côté scolaire (20260827).
--
-- personne_urgence n'est pas supprimée (pas de perte de données),
-- simplement complétée par ces deux nouveaux champs.
-- ============================================================

ALTER TABLE details_enfant_vacance ADD COLUMN IF NOT EXISTS contact_pere text;
ALTER TABLE details_enfant_vacance ADD COLUMN IF NOT EXISTS contact_mere text;

NOTIFY pgrst, 'reload schema';
