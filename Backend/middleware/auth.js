const isDevelopment = process.env.NODE_ENV !== 'production';
const supabase = require('../config/supabase');

module.exports = async (req, res, next) => {
  console.log('Environnement:', process.env.NODE_ENV);
  
  // En développement, on autorise tout
  if (isDevelopment) {
    console.log('Mode développement : authentification désactivée');
    req.user = { id: 'dev-user' };
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé : Token manquant'
    });
  }

  try {

    const { user, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé : Token invalide'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Erreur d\'authentification:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de l\'authentification'
    });
  }
};