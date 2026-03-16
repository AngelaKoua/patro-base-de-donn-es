-- Migration to ensure scolaire_animateur table structure
CREATE TABLE IF NOT EXISTS scolaire_animateur (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255),
  prenom VARCHAR(255),
  fonction VARCHAR(255),
  naissance DATE,
  sexe VARCHAR(10),
  section VARCHAR(255),
  religion VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);