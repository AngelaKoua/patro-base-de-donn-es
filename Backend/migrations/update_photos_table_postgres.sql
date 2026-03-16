-- Supprimer la table existante puisque nous ne pouvons pas facilement modifier les contraintes de clé étrangère dans Supabase
DROP TABLE IF EXISTS photos;

-- Recréer la table avec la nouvelle structure
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    enfant_id INT NOT NULL,
    enfant_type VARCHAR(10) NOT NULL CHECK (enfant_type IN ('scolaire', 'vacances')),
    photo_data BYTEA NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index pour améliorer les performances des requêtes
CREATE INDEX idx_photos_enfant ON photos(enfant_id, enfant_type);