-- Migration to update photos table structure
DO $$
BEGIN
  -- First, let's check if we need to rename the URL column to file_path
  BEGIN
    ALTER TABLE photos RENAME COLUMN url TO file_path;
  EXCEPTION
    WHEN undefined_column THEN
      -- If url doesn't exist, try to add file_path
      BEGIN
        ALTER TABLE photos ADD COLUMN file_path VARCHAR(1024);
      EXCEPTION
        WHEN duplicate_column THEN NULL;
      END;
  END;
  
  -- Ensure mime_type exists and has correct type
  BEGIN
    ALTER TABLE photos ADD COLUMN mime_type VARCHAR(255);
  EXCEPTION
    WHEN duplicate_column THEN
      ALTER TABLE photos ALTER COLUMN mime_type TYPE VARCHAR(255);
  END;
  
  -- Add created_at if it doesn't exist
  BEGIN
    ALTER TABLE photos ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;

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

  -- Drop old photo_data column if it exists (after ensuring data is migrated)
  BEGIN
    -- First make sure any existing photo_data is saved in file_path
    UPDATE photos 
    SET file_path = CONCAT('enfants/', enfant_id, '/', photo_data)
    WHERE file_path IS NULL AND photo_data IS NOT NULL;
    
    -- Then try to drop the column
    ALTER TABLE photos DROP COLUMN IF EXISTS photo_data;
  EXCEPTION
    WHEN undefined_column THEN NULL;
  END;
END $$;