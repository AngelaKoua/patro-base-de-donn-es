const express = require('express');
const router = express.Router();

// Import des middleware
const getVacanceYears = require('../middleware/getVacanceYears');
const getVacanceRepartitionSexe = require('../middleware/getVacanceRepartitionSexe');
const getVacanceRepartitionClasse = require('../middleware/getVacanceRepartitionClasse');
const getVacancePresenceRateEvolution = require('../middleware/getVacancePresenceRateEvolution');
const getVacancePresenceRateSection = require('../middleware/getVacancePresenceRateSection');
const getVacanceEvolution = require('../middleware/getVacanceEvolution'); // ← NOUVEAU

// Routes
router.get('/annees', getVacanceYears);
router.get('/repartition-sexe', getVacanceRepartitionSexe);
router.get('/repartition-classe', getVacanceRepartitionClasse);
router.get('/presence-rate-evolution/:startYear/:endYear', getVacancePresenceRateEvolution);
router.get('/presence-rate-section', getVacancePresenceRateSection);
router.get('/evolution/:startYear/:endYear', getVacanceEvolution); // ← NOUVELLE ROUTE

module.exports = router;