-- Suppression de la table existante
DROP TABLE IF EXISTS details_enfant_vacance;

-- Création de la nouvelle table
CREATE TABLE details_enfant_vacance (
    id SERIAL PRIMARY KEY,
    enfant_id INTEGER NOT NULL REFERENCES enfants_vacance(id) ON DELETE CASCADE,
    domicile VARCHAR(255),
    quartier VARCHAR(255),
    rue VARCHAR(255),
    lot VARCHAR(255),
    nom_pere VARCHAR(255),
    profession_pere VARCHAR(255),
    nom_mere VARCHAR(255),
    profession_mere VARCHAR(255),
    personne_urgence VARCHAR(255),
    ecole VARCHAR(255),
    classe VARCHAR(255),
    portfolio TEXT,
    realisation TEXT,
    nom_tuteur VARCHAR(255),
    prenom_tuteur VARCHAR(255),
    contact_tuteur VARCHAR(255),
    nom_tutrice VARCHAR(255),
    prenom_tutrice VARCHAR(255),
    contact_tutrice VARCHAR(255),
    communaute VARCHAR(255),
    est_catechumene BOOLEAN DEFAULT FALSE,
    est_bapteme BOOLEAN DEFAULT FALSE,
    est_premiere_communion BOOLEAN DEFAULT FALSE,
    est_confirmation BOOLEAN DEFAULT FALSE,
    nombre_presence INTEGER DEFAULT 0,
    nombre_presence_totale INTEGER DEFAULT 0
);