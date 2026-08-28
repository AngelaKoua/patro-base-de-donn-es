-- ============================================================
-- Remplace le champ unique "Contact d'urgence" (personne_urgence)
-- par un contact distinct pour le père et pour la mère sur la
-- fiche détails de l'enfant (onglet scolaire).
--
-- personne_urgence n'est pas supprimée (pas de perte de données),
-- simplement plus utilisée par l'UI/API à partir de cette version.
-- ============================================================

ALTER TABLE details_enfants_scolaire ADD COLUMN IF NOT EXISTS contact_pere text;
ALTER TABLE details_enfants_scolaire ADD COLUMN IF NOT EXISTS contact_mere text;

NOTIFY pgrst, 'reload schema';
