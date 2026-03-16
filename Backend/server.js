//Server.js
const express = require("express");
require('dotenv').config();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
// Configuration Supabase
const supabase = require('./config/supabase');

// Import des routes
const animateursRoutes = require('./routes/animateurs');
const evenementsVacancesRoutes = require('./routes/evenements-vacances');
const vacanceStatsRoutes = require('./routes/vacance-stats');

const port = process.env.PORT || 4400;

// Log de l'environnement au démarrage
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT
});

// Création de l'application Express
const app = express();

// Middleware CORS avec options étendues
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log middleware pour le débogage
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Middleware global pour JSON et URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// ============================================
// IMPORTS - ANIMATEURS SCOLAIRES
// ============================================
const getAnimateurs = require("./middleware/getAnimateurs");
const getAnimateur = require("./middleware/getAnimateur");
const addAnimateur = require("./middleware/addAnimateur");
const updateAnimateur = require("./middleware/updateAnimateur");
const deleteAnimateur = require("./middleware/deleteAnimateur");
const ajoutDetailsAnimateur = require("./middleware/ajoutDetailsAnimateur");

app.use('/api/vacance-evenement', evenementsVacancesRoutes);
app.use('/api/vacance_evenement', evenementsVacancesRoutes); // Route alternative avec underscore
app.use('/api/vacance', vacanceStatsRoutes); // Routes des statistiques vacances

// Redirections pour la rétrocompatibilité
app.get('/api/vacance-annees', (req, res) => {
  res.redirect(307, '/api/vacance/annees');
});

app.get('/api/vacance-repartition-classe', (req, res) => {
  res.redirect(307, '/api/vacance/repartition-classe' + (req.query.annee ? `?annee=${req.query.annee}` : ''));
});

app.get('/api/vacance-repartition-sexe', (req, res) => {
  res.redirect(307, '/api/vacance/repartition-sexe?' + new URLSearchParams(req.query));
});

app.get('/api/vacance-presence-rate-evolution/:startYear/:endYear', (req, res) => {
  res.redirect(307, `/api/vacance/presence-rate-evolution/${req.params.startYear}/${req.params.endYear}`);
});

app.get('/api/vacance-presence-rate-section', (req, res) => {
  res.redirect(307, '/api/vacance/presence-rate-section?' + new URLSearchParams(req.query));
});

app.get('/api/vacance-evolution/:startYear/:endYear', (req, res) => {
  res.redirect(307, `/api/vacance/evolution/${req.params.startYear}/${req.params.endYear}`);
});

// ============================================
// IMPORTS - GESTION PHOTOS UNIFIÉE
// ============================================
const {
  // Enfants scolaires
  uploadPhotoEnfant,
  deletePhotoEnfant,

  // Animateurs scolaires
  uploadPhotoAnimateur,
  deletePhotoAnimateur,

  // Directeurs scolaires
  uploadPhotoDirecteur,
  deletePhotoDirecteur,

  // Aumoniers scolaires
  uploadPhotoAumonier,
  deletePhotoAumonier,

  // Enfants vacances
  uploadPhotoVacanceEnfant,
  deletePhotoVacanceEnfant,

  // Animateurs vacances
  uploadPhotoVacanceAnimateur,
  deletePhotoVacanceAnimateur,

  // Directeurs vacances
  uploadPhotoVacanceDirecteur,
  deletePhotoVacanceDirecteur,

  // Aumoniers vacances
  uploadPhotoVacanceAumonier,
  deletePhotoVacanceAumonier
} = require('./middleware/genericPhotoMiddleware');

// ============================================
// IMPORTS - AUTRES MIDDLEWARES
// ============================================

// Statistiques scolaires
const getEvolution = require("./middleware/getEvolution");
const getPresenceRateEvolution = require("./middleware/getPresenceRateEvolution");
const getPresenceRateBySection = require("./middleware/getPresenceRateBySection");
const getRepartitionClasses = require("./middleware/getRepartitionClasses");
const getRepartitionSexe = require("./middleware/getRepartitionSexe");

const {
  uploadPhotoScolaire,
  uploadPhotoVacance,
  uploadVideoScolaire,
  uploadVideoVacance
} = require('./middleware/uploadEventMedia');

// Auth
const verifyToken = require("./middleware/verifyToken");
const addNewUser = require("./middleware/addNewUser");
const userLoginCheck = require("./middleware/userLoginCheck");
const welcome = require("./middleware/welcome");
const Utilisateur = require("./middleware/Data/Utilisateur");
const UserOne = require("./middleware/UserOne");

// Enfants scolaires
const getEnfants = require("./middleware/getEnfants");
const getEnfant = require("./middleware/getEnfant");
const deleteEnfant = require("./middleware/deleteEnfant");
const updateEnfant = require("./middleware/updateEnfant");
const ajoutDetailsEnfant = require("./middleware/ajoutDetailsEnfant");
const ajoutEnfantScolaire = require("./middleware/ajoutEnfantScolaire");
const getPhoto = require("./middleware/getPhoto");

// Directeurs scolaires
const getDirecteurs = require("./middleware/getDirecteurs");
const getDirecteur = require("./middleware/getDirecteur");
const addDirecteur = require("./middleware/addDirecteur");
const updateDirecteur = require("./middleware/updateDirecteur");
const deleteDirecteur = require("./middleware/deleteDirecteur");
const upsertDetailsDirecteur = require("./middleware/upsertDetailsDirecteur");

// Aumoniers scolaires
const getAumoniers = require("./middleware/getAumoniers");
const getAumonier = require("./middleware/getAumonier");
const addAumonier = require("./middleware/addAumonier");
const updateAumonier = require("./middleware/updateAumonier");
const deleteAumonier = require("./middleware/deleteAumonier");
const upsertDetailsAumonier = require("./middleware/upsertDetailsAumonier");

// Vacances - Enfants
const ajouterEnfantVacance = require("./middleware/ajouterEnfantVacance");
const getEnfantsVacance = require("./middleware/getEnfantsVacance");
const updateEnfantVacance = require("./middleware/updateEnfantVacance");
const deleteEnfantVacance = require("./middleware/deleteEnfantVacance");
const getEnfantVacance = require("./middleware/getEnfantVacance");
const upsertDetailsEnfantVacance = require("./middleware/upsertDetailsEnfantVacance");

// Vacances - Animateurs
const ajoutVacanceAnimateur = require("./middleware/ajoutVacanceAnimateur");
const getVacanceAnimateurs = require("./middleware/getVacanceAnimateurs");
const getVacanceAnimateur = require("./middleware/getVacanceAnimateur");
const updateVacanceAnimateur = require("./middleware/updateVacanceAnimateur");
const deleteVacanceAnimateur = require("./middleware/deleteVacanceAnimateur");
const ajoutDetailsVacanceAnimateur = require("./middleware/ajoutDetailsVacanceAnimateur");

// Vacances - Directeurs
const getVacanceDirecteurs = require("./middleware/getVacanceDirecteurs");
const getVacanceDirecteur = require("./middleware/getVacanceDirecteur");
const addVacanceDirecteur = require("./middleware/addVacanceDirecteur");
const updateVacanceDirecteur = require("./middleware/updateVacanceDirecteur");
const deleteVacanceDirecteur = require("./middleware/deleteVacanceDirecteur");
const ajoutDetailsVacanceDirecteur = require("./middleware/ajoutDetailsVacanceDirecteur");

// Vacances - Aumoniers
const getVacanceAumoniers = require("./middleware/getVacanceAumoniers");
const getVacanceAumonier = require("./middleware/getVacanceAumonier");
const addVacanceAumonier = require("./middleware/addVacanceAumonier");
const updateVacanceAumonier = require("./middleware/updateVacanceAumonier");
const deleteVacanceAumonier = require("./middleware/deleteVacanceAumonier");
const ajoutDetailsVacanceAumonier = require("./middleware/ajoutDetailsVacanceAumonier");

// Événements scolaires
const ajoutEvenementScolaire = require('./middleware/ajoutEvenementScolaire');
const getEvenementsScolaires = require('./middleware/getEvenementsScolaires');
const getEvenementScolaire = require('./middleware/getEvenementScolaire');
const updateEvenementScolaire = require('./middleware/updateEvenementScolaire');
const deleteEvenementScolaire = require('./middleware/deleteEvenementScolaire');
const ajoutDetailEvenementScolaire = require('./middleware/ajoutDetailEvenementScolaire');
const getDetailEvenementScolaire = require('./middleware/getDetailEvenementScolaire');

// Événements vacances
const ajoutVacanceEvenement = require("./middleware/ajoutVacanceEvenement");
const getVacanceEvenement = require("./middleware/getVacanceEvenement");
const getVacanceEvenementById = require("./middleware/getVacanceEvenementById");
const modifVacanceEvenement = require("./middleware/modifVacanceEvenement");
const supprVacanceEvenement = require("./middleware/supprVacanceEvenement");
const getDetailVacanceEvenement = require("./middleware/getDetailVacanceEvenement");
const ajoutDetailVacanceEvenement = require("./middleware/ajoutDetailVacanceEvenement");

// Test upload images
const testUploadImage = require("./middleware/testUploadImage");
const getTestImages = require("./middleware/getTestImages");
const deleteTestImage = require("./middleware/deleteTestImage");

// Test photos table
const testPhotosUpload = require("./middleware/testPhotosUpload");
const getTestPhotos = require("./middleware/getTestPhotos");
const deleteTestPhoto = require("./middleware/deleteTestPhoto");

// Simple photos (sans dépendances)
const simplePhotoUpload = require("./middleware/simplePhotoUpload");
const getSimplePhotos = require("./middleware/getSimplePhotos");
const deleteSimplePhoto = require("./middleware/deleteSimplePhoto");

// Middleware pour les années scolaires
const getAnneesScolaires = require('./middleware/getAnneesScolaires');

// ============================================
// ROUTES
// ============================================

// --- ROUTES STATISTIQUES SCOLAIRES ---
app.get("/api/annees", getAnneesScolaires);
app.get("/api/presence-rate-evolution/:start/:end", getPresenceRateEvolution);
app.get("/api/presence-rate-section", getPresenceRateBySection);
app.get("/api/repartition-classes", getRepartitionClasses);
app.get("/api/repartition-sexe", getRepartitionSexe);
app.get("/api/evolution/:startYear/:endYear", getEvolution);

// --- ROUTES UPLOAD EVENEMENTS ---
app.post('/api/upload-photo-evenement', uploadPhotoScolaire);
app.post('/api/upload-video-evenement', uploadVideoScolaire);
app.post('/api/upload-photo-vacance-evenement', uploadPhotoVacance);
app.post('/api/upload-video-vacance-evenement', uploadVideoVacance);

// --- ROUTES PUBLIQUES ---
app.get("/", welcome);
app.post("/signup", addNewUser);
app.post("/userlogin", userLoginCheck);

// ============================================
// ROUTES UPLOAD/DELETE PHOTOS - SYSTÈME UNIFIÉ
// ============================================

// --- PHOTOS ENFANTS SCOLAIRES ---
app.post('/api/upload-photo', uploadPhotoEnfant);
app.delete('/api/photos/:id', deletePhotoEnfant);
app.get('/api/photos/:enfantId', getPhoto); // Garder pour compatibilité

// --- PHOTOS ANIMATEURS SCOLAIRES ---
app.post('/api/upload-photo-animateur', uploadPhotoAnimateur);
app.delete('/api/photos-animateur/:id', deletePhotoAnimateur);

// --- PHOTOS DIRECTEURS SCOLAIRES ---
app.post('/api/upload-photo-directeur', uploadPhotoDirecteur);
app.delete('/api/photos-directeur/:id', deletePhotoDirecteur);

// --- PHOTOS AUMONIERS SCOLAIRES ---
app.post('/api/upload-photo-aumonier', uploadPhotoAumonier);
app.delete('/api/photos-aumonier/:id', deletePhotoAumonier);

// --- PHOTOS ENFANTS VACANCES ---
app.post('/api/upload-photo-vacance-enfant', uploadPhotoVacanceEnfant);
app.delete('/api/photos-vacance-enfant/:id', deletePhotoVacanceEnfant);

// --- PHOTOS ANIMATEURS VACANCES ---
app.post('/api/upload-photo-vacance-animateur', uploadPhotoVacanceAnimateur);
app.delete('/api/photos-vacance-animateur/:id', deletePhotoVacanceAnimateur);

// --- PHOTOS DIRECTEURS VACANCES ---
app.post('/api/upload-photo-vacance-directeur', uploadPhotoVacanceDirecteur);
app.delete('/api/photos-vacance-directeur/:id', deletePhotoVacanceDirecteur);

// --- PHOTOS AUMONIERS VACANCES ---
app.post('/api/upload-photo-vacance-aumonier', uploadPhotoVacanceAumonier);
app.delete('/api/photos-vacance-aumonier/:id', deletePhotoVacanceAumonier);

// ============================================
// ROUTES ENFANTS SCOLAIRES
// ============================================
app.get("/api/enfants", getEnfants);
app.get("/api/enfant/:id", getEnfant);
app.get('/api/enfants/:id', getEnfants);
app.delete("/api/enfants/:id", deleteEnfant);
app.put("/api/enfants/:id", updateEnfant);
app.post("/api/details-enfant", ajoutDetailsEnfant);
app.post("/api/ajouter-enfant", ajoutEnfantScolaire);

// ============================================
// ROUTES DIRECTEURS SCOLAIRES
// ============================================
app.get('/api/directeurs', getDirecteurs);
app.get('/api/directeurs/:id', getDirecteur);
app.post('/api/directeurs', addDirecteur);
app.put('/api/directeurs/:id', updateDirecteur);
app.delete('/api/directeurs/:id', deleteDirecteur);
app.post('/api/details-directeur', upsertDetailsDirecteur);

// ============================================
// ROUTES AUMONIERS SCOLAIRES
// ============================================
app.get('/api/aumoniers', getAumoniers);
app.get('/api/aumoniers/:id', getAumonier);
app.post('/api/aumoniers', addAumonier);
app.put('/api/aumoniers/:id', updateAumonier);
app.delete('/api/aumoniers/:id', deleteAumonier);
app.post('/api/details-aumonier', upsertDetailsAumonier);

// ============================================
// ROUTES ANIMATEURS SCOLAIRES
// ============================================
app.get('/api/animateurs', getAnimateurs);
app.get('/api/animateurs/:id', getAnimateur);
app.post('/api/animateurs', addAnimateur);
app.put('/api/animateurs/:id', updateAnimateur);
app.delete('/api/animateurs/:id', deleteAnimateur);
app.post('/api/details-animateur', ajoutDetailsAnimateur);

// ============================================
// ROUTES ENFANTS VACANCES
// ============================================
app.post('/api/ajouter-enfant-vacance', ajouterEnfantVacance);
app.get('/api/enfants-vacance', getEnfantsVacance);
app.put('/api/enfants-vacance/:id', updateEnfantVacance);
app.delete('/api/enfants-vacance/:id', deleteEnfantVacance);
app.get('/api/enfants-vacance/:id', getEnfantVacance);
app.post('/api/details-enfant-vacance', upsertDetailsEnfantVacance);

// ============================================
// ROUTES ANIMATEURS VACANCES
// ============================================
app.post('/api/vacance-animateurs', ajoutVacanceAnimateur);
app.get('/api/vacance-animateurs', getVacanceAnimateurs);
app.get('/api/vacance-animateurs/:id', getVacanceAnimateur);
app.put('/api/vacance-animateurs/:id', updateVacanceAnimateur);
app.delete('/api/vacance-animateurs/:id', deleteVacanceAnimateur);
app.post('/api/details-vacance-animateur', ajoutDetailsVacanceAnimateur);

// ============================================
// ROUTES DIRECTEURS VACANCES
// ============================================
app.get('/api/directeurs-vacance', getVacanceDirecteurs);
app.get('/api/directeurs-vacance/:id', getVacanceDirecteur);
app.post('/api/directeurs-vacance', addVacanceDirecteur);
app.put('/api/directeurs-vacance/:id', updateVacanceDirecteur);
app.delete('/api/directeurs-vacance/:id', deleteVacanceDirecteur);
app.post('/api/details-vacance-directeur/:directeur_id', ajoutDetailsVacanceDirecteur);

// ============================================
// ROUTES AUMONIERS VACANCES
// ============================================
app.get('/api/vacance-aumoniers', getVacanceAumoniers);
app.get('/api/vacance-aumoniers/:id', getVacanceAumonier);
app.post('/api/vacance-aumoniers', addVacanceAumonier);
app.put('/api/vacance-aumoniers/:id', updateVacanceAumonier);
app.delete('/api/vacance-aumoniers/:id', deleteVacanceAumonier);
app.post('/api/details-vacance-aumonier/:aumonier_id', ajoutDetailsVacanceAumonier);

// ============================================
// ROUTES EVENEMENTS SCOLAIRES
// ============================================
app.post('/api/scolaire_evenement', ajoutEvenementScolaire);
app.get('/api/scolaire_evenement', getEvenementsScolaires);
app.get('/api/scolaire_evenement/:id', getEvenementScolaire);
app.put('/api/scolaire_evenement/:id', updateEvenementScolaire);
app.delete('/api/scolaire_evenement/:id', deleteEvenementScolaire);
app.post('/api/detail-evenement', ajoutDetailEvenementScolaire);
app.get('/api/detail-evenement/:id', getDetailEvenementScolaire);

// ============================================
// ROUTES EVENEMENTS VACANCES
// ============================================
app.post('/api/vacance-evenement', ajoutVacanceEvenement);
app.get('/api/vacance-evenement', getVacanceEvenement);
app.get('/api/vacance-evenement/:id', getVacanceEvenementById);

// Routes pour les détails des événements de vacances
app.post('/api/detail-vacance-evenement', ajoutDetailVacanceEvenement);
app.get('/api/detail-vacance-evenement/:id', getDetailVacanceEvenement);

// ============================================
// ROUTES TEST IMAGES
// ============================================
app.post('/api/test/upload-image', testUploadImage);
app.get('/api/test/images', getTestImages);
app.delete('/api/test/images/:id', deleteTestImage);

// ============================================
// ROUTES TEST PHOTOS TABLE
// ============================================
app.post('/api/test-photos/upload', testPhotosUpload);
app.get('/api/test-photos/list', getTestPhotos);
app.delete('/api/test-photos/:id', deleteTestPhoto);

// ============================================
// ROUTES SIMPLE PHOTOS (SANS DÉPENDANCES)
// ============================================
app.post('/api/simple-photos/upload', simplePhotoUpload);
app.get('/api/simple-photos/list', getSimplePhotos);
app.delete('/api/simple-photos/:id', deleteSimplePhoto);

// ============================================
// ROUTES AVEC TOKEN
// ============================================
const apiRoutes = express.Router();
apiRoutes.get("/Utilisateur", verifyToken, Utilisateur);
apiRoutes.get("/UserOne/:id", verifyToken, UserOne);
app.use("/api/auth", apiRoutes);

// ============================================
// DEMARRAGE SERVEUR
// ============================================
app.listen(port, () => {
  console.log(`🚀 Serveur démarré et écoute sur le port ${port}`);
  console.log(`📸 Système d'upload de photos unifié activé`);
});