-- Supprime la table si elle existe avec ses dépendances
DROP TABLE IF EXISTS scolaire_aumonier CASCADE;

-- Crée la nouvelle table
CREATE TABLE scolaire_aumonier (
    id INT PRIMARY KEY,
    annee INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    fonction VARCHAR(100) NOT NULL
);