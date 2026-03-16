-- Supprime la table et ses dépendances si elle existe
DROP TABLE IF EXISTS scolaire_directeur CASCADE;

-- Crée la nouvelle table
CREATE TABLE scolaire_directeur (
    id INT PRIMARY KEY,
    annee INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    fonction VARCHAR(100) NOT NULL,
    naissance DATE NOT NULL
);