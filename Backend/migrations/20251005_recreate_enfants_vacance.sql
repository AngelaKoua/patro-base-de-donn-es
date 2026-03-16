-- Supprime la table si elle existe avec ses dépendances
DROP TABLE IF EXISTS enfants_vacance CASCADE;

-- Crée la nouvelle table
CREATE TABLE enfants_vacance (
    id INT PRIMARY KEY,
    annee INT NOT NULL,
    numero_inscription VARCHAR(50) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    naissance DATE NOT NULL,
    section VARCHAR(100) NOT NULL,
    sexe VARCHAR(1) NOT NULL CHECK (sexe IN ('M', 'F')),
    religion VARCHAR(50),
    classe VARCHAR(100)
);