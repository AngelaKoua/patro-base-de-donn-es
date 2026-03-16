const supabase = require('../db');

const storeToken = async (userId, token, ipAddress) => {
    try {
        const { data, error } = await supabase
            .from('access_token')
            .insert([
                {
                    user_id: userId,
                    access_token: token,
                    ip_address: ipAddress
                }
            ]);

        if (error) {
            console.error('Erreur lors de l\'insertion du token:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Erreur lors du stockage du token:', error);
        throw error;
    }
};

const verifyStoredToken = async (token) => {
    try {
        const { data, error } = await supabase
            .from('access_token')
            .select('*')
            .eq('access_token', token)
            .single();

        if (error) {
            console.error('Erreur lors de la vérification du token:', error);
            return false;
        }

        return !!data;
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        return false;
    }
};

module.exports = {
    storeToken,
    verifyStoredToken
};