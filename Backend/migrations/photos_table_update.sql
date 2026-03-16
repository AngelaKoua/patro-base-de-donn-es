-- Supprimer la contrainte de clé étrangère existante
ALTER TABLE photos
DROP FOREIGN KEY photos_ibfk_1;

-- Ajouter une colonne pour identifier le type d'enfant
ALTER TABLE photos
ADD COLUMN enfant_type ENUM('scolaire', 'vacances') NOT NULL DEFAULT 'scolaire';

-- Maintenant on peut avoir des photos pour les deux types d'enfants
ALTER TABLE photos
ADD CONSTRAINT photos_enfant_scolaire_fk
FOREIGN KEY (enfant_id) REFERENCES patronier_scolaire(id)
ON DELETE CASCADE
WHERE enfant_type = 'scolaire';

ALTER TABLE photos
ADD CONSTRAINT photos_enfant_vacances_fk
FOREIGN KEY (enfant_id) REFERENCES enfants_vacance(id)
ON DELETE CASCADE
WHERE enfant_type = 'vacances';