-- Suppression des tables existantes avec CASCADE
DROP TABLE IF EXISTS detail_evenement_vacance CASCADE;
DROP TABLE IF EXISTS evenement_vacance CASCADE;

-- Création de la table principale
CREATE TABLE evenement_vacance (
    id SERIAL PRIMARY KEY,
    annee INTEGER NOT NULL,
    evenement VARCHAR(255) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    cible VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table de détails
CREATE TABLE detail_evenement_vacance (
    id SERIAL PRIMARY KEY,
    evenement_id INTEGER NOT NULL,
    lieu VARCHAR(255),
    description TEXT,
    objectif TEXT,
    nb_patronnes_attendus INTEGER,
    nb_patronnes_presents INTEGER,
    taux_participation_patronnes FLOAT,
    nb_animateurs_attendus INTEGER,
    nb_animateurs_presents INTEGER,
    taux_participation_animateurs FLOAT,
    partenaires TEXT,
    autres_personnes_ressources TEXT,
    financement TEXT,
    aspects_positifs TEXT,
    aspects_negatifs TEXT,
    suggestions TEXT,
    photos JSONB,
    videos JSONB,
    photo1 VARCHAR(255),
    photo2 VARCHAR(255),
    photo3 VARCHAR(255),
    photo4 VARCHAR(255),
    photo5 VARCHAR(255),
    photo6 VARCHAR(255),
    photo7 VARCHAR(255),
    photo8 VARCHAR(255),
    photo9 VARCHAR(255),
    photo10 VARCHAR(255),
    video VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evenement_id) REFERENCES evenement_vacance(id) ON DELETE CASCADE
);