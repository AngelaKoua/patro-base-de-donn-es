CREATE POLICY "Enable storage for authenticated users"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  auth.role() = 'authenticated'
);

-- Réorganiser les colonnes selon l'ordre spécifié
-- PostgreSQL ne permet pas de réorganiser directement les colonnes, 
-- donc nous allons créer une nouvelle table avec l'ordre souhaité

-- 1. Créer une nouvelle table avec l'ordre correct
CREATE TABLE patronier_scolaire_new (
    id SERIAL PRIMARY KEY,
    annee INTEGER NOT NULL,
    numero_inscription VARCHAR(50) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    naissance DATE NOT NULL,
    section VARCHAR(50) NOT NULL,
    sexe VARCHAR(1) NOT NULL,
    classe VARCHAR(50) NOT NULL,
    religion VARCHAR(50) NOT NULL
);

-- 2. Copier les données de l'ancienne table vers la nouvelle
INSERT INTO patronier_scolaire_new (
    id,
    annee,
    numero_inscription,
    nom,
    prenom,
    naissance,
    section,
    sexe,
    classe,
    religion
)
SELECT 
    id,
    annee,
    COALESCE(numero_inscription, ''), -- utiliser une chaîne vide si null
    nom,
    prenom,
    naissance,
    section,
    sexe,
    classe,
    religion
FROM patronier_scolaire;

-- 3. Supprimer l'ancienne table
DROP TABLE patronier_scolaire;

-- 4. Renommer la nouvelle table
ALTER TABLE patronier_scolaire_new RENAME TO patronier_scolaire;

-- 5. Recréer les index si nécessaire
CREATE INDEX IF NOT EXISTS idx_patronier_scolaire_annee ON patronier_scolaire(annee);
CREATE INDEX IF NOT EXISTS idx_patronier_scolaire_nom ON patronier_scolaire(nom);
CREATE INDEX IF NOT EXISTS idx_patronier_scolaire_numero ON patronier_scolaire(numero_inscription);

-- 6. Ajouter les contraintes
ALTER TABLE patronier_scolaire
    ALTER COLUMN annee SET NOT NULL,
    ALTER COLUMN numero_inscription SET NOT NULL,
    ALTER COLUMN nom SET NOT NULL,
    ALTER COLUMN prenom SET NOT NULL,
    ALTER COLUMN naissance SET NOT NULL,
    ALTER COLUMN section SET NOT NULL,
    ALTER COLUMN sexe SET NOT NULL,
    ALTER COLUMN classe SET NOT NULL,
    ALTER COLUMN religion SET NOT NULL;

-- Contrainte pour s'assurer que le sexe est soit 'M' soit 'F'
ALTER TABLE patronier_scolaire
    ADD CONSTRAINT check_sexe CHECK (sexe IN ('M', 'F'));

-- Mettre à jour le cache du schéma de Supabase
NOTIFY pgrst, 'reload schema';