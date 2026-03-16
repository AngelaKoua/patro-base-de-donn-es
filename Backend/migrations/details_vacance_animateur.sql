-- Supprimer la table et ses dépendances si elle existe
DROP TABLE IF EXISTS details_vacance_animateur CASCADE;

-- Créer la nouvelle table
CREATE TABLE details_vacance_animateur (
    id SERIAL PRIMARY KEY,
    animateur_id INTEGER NOT NULL,
    email VARCHAR(150),
    contact_whatsapp VARCHAR(50),
    autre_contact VARCHAR(100),
    religion VARCHAR(100),
    realisation TEXT,
    communaute VARCHAR(100),
    est_catechumene BOOLEAN DEFAULT FALSE,
    est_bapteme BOOLEAN DEFAULT FALSE,
    est_premiere_communion BOOLEAN DEFAULT FALSE,
    est_confirmation BOOLEAN DEFAULT FALSE,
    CONSTRAINT details_vacance_animateur_animateur_id_fkey
        FOREIGN KEY (animateur_id)
        REFERENCES vacance_animateur(id)
        ON DELETE CASCADE,
    CONSTRAINT details_vacance_animateur_animateur_id_unique
        UNIQUE (animateur_id)
);

-- Ajouter des index pour améliorer les performances
CREATE INDEX idx_details_vacance_animateur_email ON details_vacance_animateur(email);
CREATE INDEX idx_details_vacance_animateur_religion ON details_vacance_animateur(religion);