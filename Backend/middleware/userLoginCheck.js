const jwt = require('jsonwebtoken');
const config = require('../config');
const { getUserByEmail, storeToken, removeToken } = require('../db');

const allowedUsers = [
    { email: 'kouaangela606@gmail.com', mot_de_passe: 'admin123' },
    { email: 'patrorsvbouake@gmail.com', mot_de_passe: 'patrorsv2025@' },
    { email: 'dialloba@gmail.com', mot_de_passe: 'diallo1123@' }
];

const userLoginCheck = async (req, res, next) => {
    try {
        if (!req.body.mot_de_passe || !req.body.email) {
            return res.status(400).json({
                "Error": true,
                "Message": "Email et mot de passe requis"
            });
        }

        const { email, mot_de_passe } = req.body;

        const allowedUser = allowedUsers.find(u => u.email === email);
        if (!allowedUser) {
            return res.status(403).json({
                "Error": true,
                "Message": "Adresse email non autorisée"
            });
        }

        if (allowedUser.mot_de_passe !== mot_de_passe) {
            return res.status(401).json({
                "Error": true,
                "Message": "Mot de passe incorrect"
            });
        }

        // Récupérer l'utilisateur depuis Supabase
        try {
            const user = await getUserByEmail(email);
            
            if (!user) {
                return res.status(404).json({
                    "Error": true,
                    "Message": "Utilisateur non trouvé dans la base de données"
                });
            }

            // Générer un token
            const token = jwt.sign(
                { id: user.id, email: email },
                config.secret,
                { expiresIn: '1h' }
            );

            // Stocker le token avec la nouvelle fonction centralisée
            const stored = await storeToken(user.id, token);
            if (!stored) {
                return res.status(500).json({
                    "Error": true,
                    "Message": "Erreur lors du stockage du token"
                });
            }

            // Ajouter le token au cookie et à la réponse
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 3600000 // 1 heure
            });

            res.json({
                Error: false,
                userId: user.id,
                email: email,
                message: 'Connexion réussie',
                token: token
            });

            next();
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            return res.status(404).json({
                "Error": true,
                "Message": "Erreur lors de la récupération de l'utilisateur"
            });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        res.status(500).json({
            "Error": true,
            "Message": "Erreur lors de la vérification"
        });
    }
};

module.exports = userLoginCheck;