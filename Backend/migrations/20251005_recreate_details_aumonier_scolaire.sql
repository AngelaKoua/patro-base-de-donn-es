-- Supprime la table si elle existe
DROP TABLE IF EXISTS details_aumonier_scolaire CASCADE;

-- Crée la nouvelle table
CREATE TABLE details_aumonier_scolaire (
    id INT PRIMARY KEY,
    aumonier_id INT NOT NULL,
    realisation TEXT,
    email VARCHAR(255),
    whatsapp VARCHAR(50),
    autre_contact VARCHAR(255),
    FOREIGN KEY (aumonier_id) REFERENCES scolaire_aumonier(id) ON DELETE CASCADE
);