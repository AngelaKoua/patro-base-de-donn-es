-- Migration to update scolaire_animateur table structure
DO $$
BEGIN
  -- Add missing columns if they don't exist
  BEGIN
    ALTER TABLE scolaire_animateur
      ADD COLUMN IF NOT EXISTS annee VARCHAR(255),
      ADD COLUMN IF NOT EXISTS religion VARCHAR(255);
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  -- Rename naissance to date_naissance if needed
  BEGIN
    ALTER TABLE scolaire_animateur RENAME COLUMN naissance TO date_naissance;
  EXCEPTION
    WHEN undefined_column THEN NULL;
    WHEN duplicate_column THEN NULL;
  END;
END $$;