-- Add useractive column to utilisateurs table
ALTER TABLE utilisateurs 
ADD COLUMN IF NOT EXISTS useractive BOOLEAN DEFAULT TRUE;

-- Update existing records to have useractive = true
UPDATE utilisateurs SET useractive = TRUE WHERE useractive IS NULL;