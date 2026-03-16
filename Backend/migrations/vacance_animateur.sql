-- Supprimer la table et ses dépendances si elle existe
DROP TABLE IF EXISTS vacance_animateur CASCADE;

-- Créer la nouvelle table
CREATE TABLE vacance_animateur (
    id SERIAL PRIMARY KEY,
    annee INTEGER NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    fonction VARCHAR(100) NOT NULL,
    naissance DATE NOT NULL,
    sexe VARCHAR(20) NOT NULL,
    section VARCHAR(100) NOT NULL,
    religion VARCHAR(100) NOT NULL
);

-- Ajouter des index pour améliorer les performances
CREATE INDEX idx_vacance_animateur_nom ON vacance_animateur(nom);
CREATE INDEX idx_vacance_animateur_annee ON vacance_animateur(annee);

-- Recréer la table des photos
CREATE TABLE IF NOT EXISTS photo_vacance_animateur (
    id SERIAL PRIMARY KEY,
    animateur_id INTEGER NOT NULL,
    photo_data BYTEA,
    CONSTRAINT photo_vacance_animateur_animateur_id_fkey
        FOREIGN KEY (animateur_id)
        REFERENCES vacance_animateur(id)
        ON DELETE CASCADE
);

-- Recréer la table des détails
CREATE TABLE IF NOT EXISTS details_vacance_animateur (
    id SERIAL PRIMARY KEY,
    animateur_id INTEGER NOT NULL,
    est_catechumene BOOLEAN DEFAULT FALSE,
    est_bapteme BOOLEAN DEFAULT FALSE,
    est_premiere_communion BOOLEAN DEFAULT FALSE,
    est_confirmation BOOLEAN DEFAULT FALSE,
    nombre_presence INTEGER DEFAULT 0,
    nombre_presence_totale INTEGER DEFAULT 0,
    email VARCHAR(100),
    whatsapp VARCHAR(100),
    autre_contact VARCHAR(100),
    realisation TEXT,
    photo_base64 TEXT,
    CONSTRAINT details_vacance_animateur_animateur_id_fkey
        FOREIGN KEY (animateur_id)
        REFERENCES vacance_animateur(id)
        ON DELETE CASCADE,
    CONSTRAINT details_vacance_animateur_animateur_id_unique
        UNIQUE (animateur_id)
);