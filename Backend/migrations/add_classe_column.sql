-- Ajouter la colonne classe à la table patronier_scolaire
ALTER TABLE patronier_scolaire 
ADD COLUMN IF NOT EXISTS classe VARCHAR(50);

-- Si vous avez besoin d'ajouter des contraintes spécifiques
ALTER TABLE patronier_scolaire
ALTER COLUMN classe SET NOT NULL; -- Décommentez cette ligne si la classe doit être obligatoire

-- Mettre à jour le cache du schéma de Supabase
NOTIFY pgrst, 'reload schema';