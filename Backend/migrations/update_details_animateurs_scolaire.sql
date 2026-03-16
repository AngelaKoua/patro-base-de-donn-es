-- Migration pour mettre à jour la table details_animateurs_scolaire
DO $$
BEGIN
  -- Créer la table si elle n'existe pas
  CREATE TABLE IF NOT EXISTS details_animateurs_scolaire (
    id SERIAL PRIMARY KEY,
    animateur_id INTEGER REFERENCES scolaire_animateur(id) ON DELETE CASCADE,
    email VARCHAR(255),
    contact_whatsapp VARCHAR(50),
    autre_contact VARCHAR(50),
    religion VARCHAR(100),
    realisation TEXT,
    communaute VARCHAR(255),
    est_catechumene BOOLEAN DEFAULT false,
    est_bapteme BOOLEAN DEFAULT false,
    est_premiere_communion BOOLEAN DEFAULT false,
    est_confirmation BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Ajouter les colonnes si elles n'existent pas déjà
  BEGIN
    ALTER TABLE details_animateurs_scolaire 
      ADD COLUMN IF NOT EXISTS email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contact_whatsapp VARCHAR(50),
      ADD COLUMN IF NOT EXISTS autre_contact VARCHAR(50),
      ADD COLUMN IF NOT EXISTS religion VARCHAR(100),
      ADD COLUMN IF NOT EXISTS realisation TEXT,
      ADD COLUMN IF NOT EXISTS communaute VARCHAR(255),
      ADD COLUMN IF NOT EXISTS est_catechumene BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS est_bapteme BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS est_premiere_communion BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS est_confirmation BOOLEAN DEFAULT false;
  EXCEPTION
    WHEN duplicate_column THEN 
      NULL;
  END;

  -- Ajouter une contrainte unique sur animateur_id si elle n'existe pas déjà
  BEGIN
    ALTER TABLE details_animateurs_scolaire
      ADD CONSTRAINT unique_animateur_details UNIQUE (animateur_id);
  EXCEPTION
    WHEN duplicate_table THEN NULL;
  END;

  -- Ajouter un trigger pour mettre à jour updated_at automatiquement
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Créer le trigger s'il n'existe pas déjà
  DROP TRIGGER IF EXISTS update_details_animateurs_scolaire_updated_at ON details_animateurs_scolaire;
  
  CREATE TRIGGER update_details_animateurs_scolaire_updated_at
    BEFORE UPDATE ON details_animateurs_scolaire
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

END $$;