-- Les mots de passe des utilisateurs sont désormais stockés hachés (bcrypt) dans utilisateurs.mot_de_passe.
-- pgcrypto fournit crypt()/gen_salt('bf') pour générer les hachages directement depuis le SQL Editor.
-- Ne jamais committer de mot de passe en clair : définir les mots de passe uniquement dans le SQL Editor de Supabase.
create extension if not exists pgcrypto with schema extensions;
