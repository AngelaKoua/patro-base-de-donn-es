-- Create the function to update presence counts
CREATE OR REPLACE FUNCTION update_presence_counts(
  p_enfant_id INTEGER,
  p_nombre_presences INTEGER,
  p_nombre_presences_total INTEGER
) RETURNS void AS $$
BEGIN
  -- Try to update existing columns if they exist
  BEGIN
    UPDATE details_enfants_scolaire 
    SET 
      nombre_presences = p_nombre_presences,
      nombre_presences_total = p_nombre_presences_total
    WHERE enfant_id = p_enfant_id;
  EXCEPTION 
    WHEN undefined_column THEN
      -- If columns don't exist, create them first
      ALTER TABLE details_enfants_scolaire
      ADD COLUMN IF NOT EXISTS nombre_presences INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS nombre_presences_total INTEGER DEFAULT 0;
      
      -- Then try the update again
      UPDATE details_enfants_scolaire 
      SET 
        nombre_presences = p_nombre_presences,
        nombre_presences_total = p_nombre_presences_total
      WHERE enfant_id = p_enfant_id;
  END;
END;
$$ LANGUAGE plpgsql;