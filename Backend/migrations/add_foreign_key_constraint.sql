-- Ajout de la contrainte de clé étrangère manquante
ALTER TABLE access_token
ADD CONSTRAINT access_token_user_id_fkey
FOREIGN KEY (user_id) REFERENCES utilisateurs(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- S'assurer que l'utilisateur avec ID 1 existe
INSERT INTO utilisateurs (id, nom, prenom, email, password, useractive)
SELECT 1, 'Admin', 'Admin', 'admin@example.com', '$2a$10$default_hash', 1
WHERE NOT EXISTS (SELECT 1 FROM utilisateurs WHERE id = 1);