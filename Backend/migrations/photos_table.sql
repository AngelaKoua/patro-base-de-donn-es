-- Suppression de la table photos si elle existe
DROP TABLE IF EXISTS photos;

-- Création de la nouvelle table photos
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    enfant_id INT NOT NULL,
    photo_data BYTEA NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enfant_id) REFERENCES enfants_vacance(id) ON DELETE CASCADE
);