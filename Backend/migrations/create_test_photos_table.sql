-- Table de test pour les photos (sans contrainte de clé étrangère)
CREATE TABLE test_photos (
  id BIGSERIAL PRIMARY KEY,
  titre TEXT,
  description TEXT,
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  mime_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_test_photos_created_at ON test_photos(created_at DESC);

-- Commentaires
COMMENT ON TABLE test_photos IS 'Table de test pour uploader et afficher des photos sans dépendances';
COMMENT ON COLUMN test_photos.titre IS 'Titre de la photo';
COMMENT ON COLUMN test_photos.description IS 'Description de la photo';
COMMENT ON COLUMN test_photos.file_path IS 'Chemin du fichier dans Supabase Storage';
COMMENT ON COLUMN test_photos.public_url IS 'URL publique pour accéder à la photo';
COMMENT ON COLUMN test_photos.mime_type IS 'Type MIME (image/jpeg, image/png, etc.)';
COMMENT ON COLUMN test_photos.file_size IS 'Taille du fichier en octets';
