-- Suppression des tables existantes et leurs dépendances
DROP TABLE IF EXISTS scolaire_evenement CASCADE;
DROP TABLE IF EXISTS detail_evenement_scolaire CASCADE;
DROP TABLE IF EXISTS enfant CASCADE;

-- Création de la table enfant
CREATE TABLE enfant (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE,
    sexe VARCHAR(1) CHECK (sexe IN ('M', 'F')),
    classe VARCHAR(255),
    section VARCHAR(255),
    allergies TEXT,
    photo_base64 TEXT
);

-- Création de la nouvelle table scolaire_evenement
CREATE TABLE scolaire_evenement (
    id SERIAL PRIMARY KEY,
    annee INTEGER NOT NULL,
    evenement VARCHAR(255) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    cible VARCHAR(255) NOT NULL
);

-- Recréation de la table detail_evenement_scolaire
CREATE TABLE detail_evenement_scolaire (
    id SERIAL PRIMARY KEY,
    evenement_id INTEGER NOT NULL,
    enfant_id INTEGER NOT NULL,
    present BOOLEAN DEFAULT false,
    FOREIGN KEY (evenement_id) REFERENCES scolaire_evenement(id) ON DELETE CASCADE,
    FOREIGN KEY (enfant_id) REFERENCES enfant(id) ON DELETE CASCADE
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX idx_scolaire_evenement_annee ON scolaire_evenement(annee);
CREATE INDEX idx_scolaire_evenement_dates ON scolaire_evenement(date_debut, date_fin);

-- Commentaires sur les colonnes
COMMENT ON TABLE scolaire_evenement IS 'Table des événements scolaires';
COMMENT ON COLUMN scolaire_evenement.id IS 'Identifiant unique de l''événement';
COMMENT ON COLUMN scolaire_evenement.annee IS 'Année de l''événement';
COMMENT ON COLUMN scolaire_evenement.evenement IS 'Nom ou description de l''événement';
COMMENT ON COLUMN scolaire_evenement.date_debut IS 'Date de début de l''événement';
COMMENT ON COLUMN scolaire_evenement.date_fin IS 'Date de fin de l''événement';
COMMENT ON COLUMN scolaire_evenement.cible IS 'Public cible de l''événement';

-- Contrainte pour s'assurer que la date de fin est après la date de début
ALTER TABLE scolaire_evenement
ADD CONSTRAINT check_dates_order 
CHECK (date_fin >= date_debut);