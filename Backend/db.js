require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key are required');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };

// Fonction pour créer un nouvel utilisateur
const createUser = async (email) => {
    try {
        console.log('Début de createUser pour:', email);
        

        
        console.log('Recherche de l\'utilisateur existant avec l\'email:', email);
        
        // Vérifier si l'utilisateur existe déjà
        const { data: existingUser, error: searchError } = await supabase
            .from('utilisateurs')
            .select('id, email, mot_de_passe, nom, prenom, telephone, created_at')
            .eq('email', email)
            .maybeSingle();

        if (searchError) {
            console.error('Erreur lors de la recherche de l\'utilisateur:', searchError);
            throw new Error(`Erreur lors de la recherche: ${searchError.message}`);
        }

        if (existingUser) {
            console.log('Utilisateur existant trouvé:', existingUser);
            return existingUser;
        }

        console.log('Aucun utilisateur existant trouvé, création d\'un nouveau...');

        // Préparer les données de l'utilisateur
        const newUser = {
            email,
            created_at: new Date().toISOString()
        };
        
        console.log('Tentative de création d\'un nouvel utilisateur avec:', newUser);

        // Créer l'utilisateur
        const { data: createdUser, error: createError } = await supabase
            .from('utilisateurs')
            .insert([newUser])
            .select()
            .single();

        if (createError) {
            console.error('Erreur lors de la création de l\'utilisateur:', createError);
            throw new Error(`Impossible de créer l'utilisateur: ${createError.message}`);
        }

        if (!createdUser) {
            throw new Error('Aucune donnée retournée après la création de l\'utilisateur');
        }

        console.log('Nouvel utilisateur créé avec succès:', createdUser);
        return createdUser;

    } catch (error) {
        console.error('Erreur dans createUser:', error);
        throw error;
    }
};

// Fonctions de gestion des tokens
const storeToken = async (userId, token) => {
    try {
        console.log('Début de storeToken pour l\'utilisateur:', userId);

        // Vérifier d'abord que l'utilisateur existe
        const { data: tokenUser, error: checkError } = await supabase
            .from('utilisateurs')
            .select('id, email, mot_de_passe, nom, prenom, telephone')
            .eq('id', userId)
            .single();

        if (checkError) {
            console.error('Erreur lors de la vérification de l\'utilisateur:', checkError);
            throw new Error(`Utilisateur introuvable: ${checkError.message}`);
        }

        if (!tokenUser) {
            throw new Error(`Aucun utilisateur trouvé avec l'ID: ${userId}`);
        }

        console.log('Suppression des anciens tokens...');
        // D'abord, supprimer les anciens tokens
        const { error: deleteError } = await supabase
            .from('access_token')
            .delete()
            .eq('user_id', userId);
            
        if (deleteError) {
            console.error('Erreur lors de la suppression des anciens tokens:', deleteError);
            // On continue malgré l'erreur de suppression
        }

        // Créer le nouveau token avec une expiration d'1 heure
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        
        console.log('Insertion du nouveau token...');
        const { data, error: insertError } = await supabase
            .from('access_token')
            .insert([{
                user_id: userId,
                token: token,
                expires_at: expiresAt
            }])
            .select();
        
        if (insertError) {
            console.error('Erreur lors du stockage du token:', insertError);
            throw new Error(`Erreur de stockage du token: ${insertError.message}`);
        }

        console.log('Token stocké avec succès');
        return true;
    } catch (error) {
        console.error('Erreur dans storeToken:', error);
        throw error;
    }
};

const verifyToken = async (token) => {
    try {
        console.log('Vérification du token...');
        const { data, error } = await supabase
            .from('access_token')
            .select('*')
            .eq('token', token)
            .gt('expires_at', new Date().toISOString())
            .single();
        
        if (error) {
            console.error('Erreur lors de la vérification du token:', error);
            return false;
        }
        return !!data;
    } catch (error) {
        console.error('Erreur dans verifyToken:', error);
        return false;
    }
};

const removeToken = async (token) => {
    try {
        console.log('Suppression du token...');
        const { error } = await supabase
            .from('access_token')
            .delete()
            .eq('token', token);
        
        if (error) {
            console.error('Erreur lors de la suppression du token:', error);
            throw error;
        }
        console.log('Token supprimé avec succès');
        return true;
    } catch (error) {
        console.error('Erreur dans removeToken:', error);
        throw error;
    }
};

module.exports = {
    createUser,
    getUserByEmail: createUser, // On utilise createUser directement car il gère déjà la recherche
    storeToken,
    verifyToken,
    removeToken
};