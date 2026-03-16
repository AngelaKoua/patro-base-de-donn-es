-- Vérifier la structure actuelle de la table photos
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'photos';

-- Recréer la table photos si nécessaire
CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    enfant_id INTEGER NOT NULL,
    photo_data BYTEA NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);