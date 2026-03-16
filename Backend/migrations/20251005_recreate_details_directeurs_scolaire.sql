-- Supprime la table si elle existe
DROP TABLE IF EXISTS details_directeurs_scolaire CASCADE;

-- Crée la nouvelle table
CREATE TABLE details_directeurs_scolaire (
    id INT PRIMARY KEY,
    directeur_id INT NOT NULL,
    realisation TEXT,
    email VARCHAR(255),
    whatsapp VARCHAR(50),
    autre_contact VARCHAR(255),
    FOREIGN KEY (directeur_id) REFERENCES scolaire_directeur(id) ON DELETE CASCADE
);