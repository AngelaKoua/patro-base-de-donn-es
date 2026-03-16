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
