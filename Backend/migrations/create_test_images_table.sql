-- Table pour stocker les images de test
CREATE TABLE IF NOT EXISTS test_images (
  id BIGSERIAL PRIMARY KEY,
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  mime_type VARCHAR(100),
  file_size INTEGER,
  original_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_test_images_created_at ON test_images(created_at DESC);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_test_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_test_images_updated_at
  BEFORE UPDATE ON test_images
  FOR EACH ROW
  EXECUTE FUNCTION update_test_images_updated_at();

-- Commentaires sur la table
COMMENT ON TABLE test_images IS 'Table pour stocker les images de test uploadées dans Supabase Storage';
COMMENT ON COLUMN test_images.file_path IS 'Chemin du fichier dans le bucket Supabase Storage';
COMMENT ON COLUMN test_images.public_url IS 'URL publique pour accéder à l''image';
COMMENT ON COLUMN test_images.mime_type IS 'Type MIME de l''image (image/jpeg, image/png, etc.)';
COMMENT ON COLUMN test_images.file_size IS 'Taille du fichier en octets';
COMMENT ON COLUMN test_images.original_name IS 'Nom original du fichier uploadé';
