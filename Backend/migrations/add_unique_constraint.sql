-- Ajouter une contrainte unique sur enfant_id
ALTER TABLE photos ADD CONSTRAINT photos_enfant_id_unique UNIQUE (enfant_id);