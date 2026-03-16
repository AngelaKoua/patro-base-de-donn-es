const jwt = require('jsonwebtoken');
const config = require('../config');
const { verifyToken: verifyTokenDB } = require('../db');

const verifyToken = async (req, res, next) => {
    // En développement, on skip la vérification du token
    if (process.env.NODE_ENV === 'development') {
        return next();
    }

    try {
        const token = req.body.token || req.query.token || req.headers['token'];
        
        if (!token) {
            return res.status(401).json({
                error: true,
                message: "Accès non autorisé : Token manquant"
            });
        }

        // Vérifier si le token existe et est valide dans Supabase
        const isValidToken = await verifyTokenDB(token);
        if (!isValidToken) {
            return res.status(401).json({
                error: true,
                message: "Token invalide ou expiré"
            });
        }

        // Vérifier la signature JWT
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    error: true,
                    message: "Token invalide ou expiré",
                    details: err.message
                });
            }

            req.currUser = decoded;
            next();
        });


} catch (error) {
    res.json({"Error" : true, "Message" : error });

}

};
module.exports=verifyToken;