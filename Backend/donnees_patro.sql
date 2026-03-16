CREATE DATABASE donnees_patro;

USE donnees_patro;



CREATE TABLE patronier_scolaire (
    id INT PRIMARY KEY AUTO_INCREMENT,
    annee INT NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    date_naissance DATE NOT NULL,
    section TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE utilisateurs (
  id int PRIMARY KEY AUTO_INCREMENT ,
  nom varchar(50) DEFAULT NULL,
  prenom varchar(50) DEFAULT NULL,
  telephone varchar(50) DEFAULT NULL,
  email varchar(100) DEFAULT NULL,
  password varchar(255) DEFAULT NULL,
  useractive int NOT NULL DEFAULT '1',
  dateMAJ datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE users (
  id int PRIMARY KEY AUTO_INCREMENT ,
  nom varchar(50) DEFAULT NULL,
  prenom varchar(50) DEFAULT NULL,
  age int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE access_token (
  access_token_id int PRIMARY KEY AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  access_token text,
  ip_address varchar(15) DEFAULT NULL,
  DateMAJ datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS patronier_scolaire;

CREATE TABLE patronier_scolaire (
    id INT PRIMARY KEY AUTO_INCREMENT,
    annee INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    naissance DATE NOT NULL,
    section VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE patronier_scolaire
ADD COLUMN sexe VARCHAR(1) NOT NULL DEFAULT 'M',
ADD COLUMN religion VARCHAR(50) NOT NULL DEFAULT 'Chrétien catholique';

CREATE TABLE details_enfants_vacances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  enfant_id INT NOT NULL,
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
  nombre_presence INT DEFAULT 0,
  nombre_presence_totale INT DEFAULT 0,
  FOREIGN KEY (enfant_id) REFERENCES patronier_scolaire(id)
);

CREATE TABLE IF NOT EXISTS photos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  enfant_id INT NOT NULL,
  photo_data LONGBLOB NOT NULL,
  mime_type VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (enfant_id) REFERENCES patronier_scolaire(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS animateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    fonction VARCHAR(100) NOT NULL,
    naissance DATE NOT NULL,
    sexe ENUM('M', 'F') NOT NULL,
    section VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

RENAME TABLE animateurs TO animateurs_scolaire;

DROP TABLE IF EXISTS details_enfants_vacances;

CREATE TABLE details_enfants_scolaire (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enfant_id INT NOT NULL,
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
    catechumene BOOLEAN DEFAULT FALSE,
    catechumene_annee INT,
    bapteme BOOLEAN DEFAULT FALSE,
    bapteme_annee INT,
    communion BOOLEAN DEFAULT FALSE,
    communion_annee INT,
    confirmation BOOLEAN DEFAULT FALSE,
    confirmation_annee INT,
    FOREIGN KEY (enfant_id) REFERENCES patronier_scolaire(id)
);

DROP TABLE IF EXISTS photos;

CREATE TABLE IF NOT EXISTS photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  enfant_id INT NOT NULL,
  chemin VARCHAR(255) NOT NULL,
  date_upload DATETIME NOT NULL,
  FOREIGN KEY (enfant_id) REFERENCES details_enfants_scolaire(id)
);

ALTER TABLE patronier_scolaire ADD COLUMN numero_inscription VARCHAR(50) NOT NULL AFTER id;



ALTER TABLE enfants_vacance
  DROP COLUMN nombre_presence,
  DROP COLUMN nombre_presence_totale,
  ADD COLUMN numero_inscription VARCHAR(50) NOT NULL AFTER annee;

CREATE TABLE Scolaire_evenement (
  id INT AUTO_INCREMENT PRIMARY KEY,
  annee INT NOT NULL,
  evenement VARCHAR(255) NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  cible VARCHAR(255) NOT NULL
);


CREATE TABLE detail_evenement_scolaire (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evenement_id INT NOT NULL,
  lieu VARCHAR(255),
  description TEXT,
  objectif TEXT,
  nb_patronnes_attendus INT,
  nb_patronnes_presents INT,
  taux_participation_patronnes FLOAT,
  nb_animateurs_attendus INT,
  nb_animateurs_presents INT,
  taux_participation_animateurs FLOAT,
  partenaires TEXT,
  autres_personnes_ressources TEXT,
  financement TEXT,
  aspects_positifs TEXT,
  aspects_negatifs TEXT,
  suggestions TEXT,
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
  FOREIGN KEY (evenement_id) REFERENCES scolaire_evenement(id) ON DELETE CASCADE
);

CREATE TABLE evenement_vacance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  annee INT NOT NULL,
  evenement VARCHAR(255) NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  cible VARCHAR(255) NOT NULL
);

CREATE TABLE detail_evenement_vacance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evenement_id INT NOT NULL,
  lieu VARCHAR(255),
  description TEXT,
  objectif TEXT,
  nb_patronnes_attendus INT DEFAULT 0,
  nb_patronnes_presents INT DEFAULT 0,
  taux_participation_patronnes FLOAT DEFAULT 0,
  nb_animateurs_attendus INT DEFAULT 0,
  nb_animateurs_presents INT DEFAULT 0,
  taux_participation_animateurs FLOAT DEFAULT 0,
  partenaires VARCHAR(255),
  autres_personnes_ressources VARCHAR(255),
  financement VARCHAR(255),
  aspects_positifs TEXT,
  aspects_negatifs TEXT,
  suggestions TEXT,
  photos TEXT,
  videos TEXT,
  FOREIGN KEY (evenement_id) REFERENCES evenement_vacance(id) ON DELETE CASCADE
);

-- Ajoute la colonne photo à la table patronier_scolaire
ALTER TABLE patronier_scolaire
ADD COLUMN photo VARCHAR(255);

ALTER TABLE detail_evenement_scolaire
  ADD COLUMN photo1 VARCHAR(255),
  ADD COLUMN photo2 VARCHAR(255),
  ADD COLUMN photo3 VARCHAR(255),
  ADD COLUMN photo4 VARCHAR(255),
  ADD COLUMN photo5 VARCHAR(255),
  ADD COLUMN photo6 VARCHAR(255),
  ADD COLUMN photo7 VARCHAR(255),
  ADD COLUMN photo8 VARCHAR(255),
  ADD COLUMN photo9 VARCHAR(255),
  ADD COLUMN photo10 VARCHAR(255),
  ADD COLUMN video VARCHAR(255);

  DROP TABLE IF EXISTS detail_vacance_evenement;

ALTER TABLE detail_evenement_vacance
  ADD COLUMN photo1 VARCHAR(255),
  ADD COLUMN photo2 VARCHAR(255),
  ADD COLUMN photo3 VARCHAR(255),
  ADD COLUMN photo4 VARCHAR(255),
  ADD COLUMN photo5 VARCHAR(255),
  ADD COLUMN photo6 VARCHAR(255),
  ADD COLUMN photo7 VARCHAR(255),
  ADD COLUMN photo8 VARCHAR(255),
  ADD COLUMN photo9 VARCHAR(255),
  ADD COLUMN photo10 VARCHAR(255),
  ADD COLUMN video VARCHAR(255);

  ALTER TABLE patronier_scolaire
ADD COLUMN nombre_presences INT DEFAULT 0,
ADD COLUMN nombre_presences_total INT DEFAULT 0;

SELECT annee, sexe, COUNT(*) FROM patronier_scolaire GROUP BY annee, sexe;

ALTER TABLE details_enfant_vacance
  ADD COLUMN nombre_presence INT DEFAULT 0,
  ADD COLUMN nombre_presence_totale INT DEFAULT 0;

SELECT * FROM scolaire_animateur LIMIT 5;

SHOW TABLES;

-- Migration : Ajout des champs de présence dans patronier_scolaire
ALTER TABLE patronier_scolaire
ADD COLUMN nombre_presences INT DEFAULT 0,
ADD COLUMN nombre_presences_total INT DEFAULT 0;

-- Migration SQL pour adapter la table detail_vacance_evenement
ALTER TABLE detail_vacance_evenement
  ADD COLUMN photo1 VARCHAR(255) DEFAULT NULL,
  ADD COLUMN photo2 VARCHAR(255) DEFAULT NULL,
  ADD COLUMN photo3 VARCHAR(255) DEFAULT NULL,
  ADD COLUMN photo4 VARCHAR(255) DEFAULT NULL,
  ADD COLUMN photo5 VARCHAR(255) DEFAULT NULL,
  ADD COLUMN photo6 VARCHAR(255) DEFAULT NULL,
  ADD COLUMN photo7 VARCHAR(255) DEFAULT NULL,
  ADD COLUMN photo8 VARCHAR(255) DEFAULT NULL,
  ADD COLUMN photo9 VARCHAR(255) DEFAULT NULL,
  ADD COLUMN photo10 VARCHAR(255) DEFAULT NULL,
  ADD COLUMN video VARCHAR(255) DEFAULT NULL;

-- Si photos/videos sous forme de tableau existent, il faut les supprimer :
-- ALTER TABLE detail_vacance_evenement DROP COLUMN photos, DROP COLUMN videos;

