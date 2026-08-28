-- ============================================================
-- Photos animateurs / directeurs / aumôniers / enfants vacances
--
-- Constat (reproduit en direct) : la table `photos` ne possède
-- QUE la colonne enfant_id (enfants scolaires). Les colonnes
-- animateur_id, directeur_id, aumonier_id, vacance_animateur_id,
-- vacance_directeur_id, vacance_aumonier_id et vacance_enfant_id
-- n'existent pas du tout, alors que le code (src/lib/photo-upload.ts
-- via handlePhotoUpload) les utilise pour TOUS les types d'entités.
-- Résultat : l'upload de photo échoue avec une erreur 500
-- ("Could not find the 'xxx_id' column of 'photos'") pour tout
-- sauf les enfants scolaires.
--
-- Cette migration ajoute les colonnes manquantes, avec directement
-- ON DELETE CASCADE (pour que supprimer une fiche animateur/
-- directeur/aumônier/enfant-vacances supprime aussi sa photo, sans
-- l'erreur 500 initialement signalée pour les enfants scolaires).
--
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

ALTER TABLE photos ADD COLUMN IF NOT EXISTS animateur_id INTEGER REFERENCES scolaire_animateur(id) ON DELETE CASCADE;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS directeur_id INTEGER REFERENCES scolaire_directeur(id) ON DELETE CASCADE;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS aumonier_id INTEGER REFERENCES scolaire_aumonier(id) ON DELETE CASCADE;

ALTER TABLE photos ADD COLUMN IF NOT EXISTS vacance_animateur_id INTEGER REFERENCES vacance_animateur(id) ON DELETE CASCADE;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS vacance_directeur_id INTEGER REFERENCES vacance_directeur(id) ON DELETE CASCADE;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS vacance_aumonier_id INTEGER REFERENCES vacance_aumonier(id) ON DELETE CASCADE;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS vacance_enfant_id INTEGER REFERENCES enfants_vacance(id) ON DELETE CASCADE;

NOTIFY pgrst, 'reload schema';
