-- Suppression de la table existante
DROP TABLE IF EXISTS photos_vacance_enfant;

-- Création de la nouvelle table avec les colonnes spécifiées
CREATE TABLE photos_vacance_enfant (
    id SERIAL PRIMARY KEY,
    enfant_id INTEGER NOT NULL REFERENCES enfants_vacance(id) ON DELETE CASCADE,
    photo_base64 TEXT,  -- Utilisation de TEXT au lieu de LONGTEXT car Postgres ne supporte pas LONGTEXT
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enfant_vacance
        FOREIGN KEY (enfant_id)
        REFERENCES enfants_vacance(id)
        ON DELETE CASCADE
);