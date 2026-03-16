-- Migration : Ajout des champs de présence dans patronier_scolaire
ALTER TABLE patronier_scolaire
ADD COLUMN nombre_presences INT DEFAULT 0,
ADD COLUMN nombre_presences_total INT DEFAULT 0;
