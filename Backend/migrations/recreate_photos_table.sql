-- Supprimer l'ancienne table photos
DROP TABLE IF EXISTS photos;

-- Recréer la table photos sans contrainte de clé étrangère pour pouvoir gérer les deux types d'enfants
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    enfant_id INT NOT NULL,
    enfant_type VARCHAR(10) NOT NULL CHECK (enfant_type IN ('scolaire', 'vacance')),
    photo_data BYTEA NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index pour améliorer les performances
CREATE INDEX idx_photos_enfant ON photos(enfant_id, enfant_type);