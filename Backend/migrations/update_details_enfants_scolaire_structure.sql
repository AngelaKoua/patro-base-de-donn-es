-- Drop the existing function as it's no longer needed
DROP FUNCTION IF EXISTS update_presence_counts;

-- Update photos table structure
DO $$
DECLARE
  column_exists boolean;
BEGIN
  -- Check if file_path column exists
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'photos' 
    AND column_name = 'file_path'
  ) INTO column_exists;

  -- Add file_path column if it doesn't exist
  IF NOT column_exists THEN
    ALTER TABLE photos ADD COLUMN file_path VARCHAR(1024);
  END IF;

  -- Ensure mime_type has the correct type
  BEGIN
    ALTER TABLE photos ALTER COLUMN mime_type TYPE VARCHAR(255);
  EXCEPTION
    WHEN undefined_column THEN
      ALTER TABLE photos ADD COLUMN mime_type VARCHAR(255);
  END;
  
  -- Now we can safely update file_path
  UPDATE photos 
  SET file_path = CONCAT('enfants/', enfant_id, '/', id, CASE 
    WHEN mime_type LIKE 'image/jpeg' THEN '.jpg'
    WHEN mime_type LIKE 'image/png' THEN '.png'
    ELSE '.jpg'
  END)
  WHERE file_path IS NULL;
  
  -- Add constraints if they don't exist
  BEGIN
    ALTER TABLE photos ADD CONSTRAINT photos_enfant_id_fkey 
      FOREIGN KEY (enfant_id) REFERENCES patronier_scolaire(id);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE photos ADD CONSTRAINT photos_enfant_id_key UNIQUE (enfant_id);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
END $$;

-- Ensure details_enfants_scolaire table has the correct structure
CREATE TABLE IF NOT EXISTS details_enfants_scolaire (
  id SERIAL PRIMARY KEY,
  enfant_id INTEGER REFERENCES patronier_scolaire(id),
  domicile VARCHAR(255),
  quartier VARCHAR(255),
  rue VARCHAR(255),
  lot VARCHAR(255),
  nom_pere VARCHAR(255),
  profession_pere VARCHAR(255),
  nom_mere VARCHAR(255),
  profession_mere VARCHAR(255),
  personne_urgence VARCHAR(255),
  ecole VARCHAR(255),
  classe VARCHAR(255),
  portfolio TEXT,
  realisation TEXT,
  communaute VARCHAR(255),
  est_catechumene BOOLEAN DEFAULT false,
  est_bapteme BOOLEAN DEFAULT false,
  est_premiere_communion BOOLEAN DEFAULT false,
  est_confirmation BOOLEAN DEFAULT false,
  nom_tuteur VARCHAR(255),
  prenom_tuteur VARCHAR(255),
  contact_tuteur VARCHAR(255),
  nom_tutrice VARCHAR(255),
  prenom_tutrice VARCHAR(255),
  contact_tutrice VARCHAR(255),
  nombre_presences INTEGER DEFAULT 0,
  nombre_presences_total INTEGER DEFAULT 0
);

-- Add any missing columns if the table already exists
DO $$ 
BEGIN
  -- Add columns if they don't exist
  BEGIN
    ALTER TABLE details_enfants_scolaire 
      ADD COLUMN IF NOT EXISTS domicile VARCHAR(255),
      ADD COLUMN IF NOT EXISTS quartier VARCHAR(255),
      ADD COLUMN IF NOT EXISTS rue VARCHAR(255),
      ADD COLUMN IF NOT EXISTS lot VARCHAR(255),
      ADD COLUMN IF NOT EXISTS nom_pere VARCHAR(255),
      ADD COLUMN IF NOT EXISTS profession_pere VARCHAR(255),
      ADD COLUMN IF NOT EXISTS nom_mere VARCHAR(255),
      ADD COLUMN IF NOT EXISTS profession_mere VARCHAR(255),
      ADD COLUMN IF NOT EXISTS personne_urgence VARCHAR(255),
      ADD COLUMN IF NOT EXISTS ecole VARCHAR(255),
      ADD COLUMN IF NOT EXISTS classe VARCHAR(255),
      ADD COLUMN IF NOT EXISTS portfolio TEXT,
      ADD COLUMN IF NOT EXISTS realisation TEXT,
      ADD COLUMN IF NOT EXISTS communaute VARCHAR(255),
      ADD COLUMN IF NOT EXISTS est_catechumene BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS est_bapteme BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS est_premiere_communion BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS est_confirmation BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS nom_tuteur VARCHAR(255),
      ADD COLUMN IF NOT EXISTS prenom_tuteur VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contact_tuteur VARCHAR(255),
      ADD COLUMN IF NOT EXISTS nom_tutrice VARCHAR(255),
      ADD COLUMN IF NOT EXISTS prenom_tutrice VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contact_tutrice VARCHAR(255),
      ADD COLUMN IF NOT EXISTS nombre_presences INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS nombre_presences_total INTEGER DEFAULT 0;
  EXCEPTION 
    WHEN duplicate_column THEN 
      NULL;
  END;
END $$;

