-- Supprimer d'abord la contrainte de clé étrangère existante
ALTER TABLE access_token 
DROP CONSTRAINT IF EXISTS access_token_user_id_fkey;

-- Ajouter la nouvelle contrainte de clé étrangère qui pointe vers la table utilisateurs
ALTER TABLE access_token
ADD CONSTRAINT access_token_user_id_fkey
FOREIGN KEY (user_id) 
REFERENCES utilisateurs(id)
ON DELETE CASCADE;