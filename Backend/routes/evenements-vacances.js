const express = require('express');
const router = express.Router();

// Import des middleware
const ajoutVacanceEvenement = require("../middleware/ajoutVacanceEvenement");
const getVacanceEvenement = require("../middleware/getVacanceEvenement");
const getVacanceEvenementById = require("../middleware/getVacanceEvenementById");
const updateVacanceEvenement = require("../middleware/updateVacanceEvenement");
const deleteVacanceEvenement = require("../middleware/deleteVacanceEvenement");
const getVacanceYears = require("../middleware/getVacanceYears");

// Routes pour les événements de vacances (sans authentification)
router.get('/years', getVacanceYears); // Cette route doit être avant '/:id' pour éviter les conflits
router.post('/', ajoutVacanceEvenement);
router.get('/', getVacanceEvenement);
router.get('/:id', getVacanceEvenementById);
router.put('/:id', updateVacanceEvenement);
router.delete('/:id', deleteVacanceEvenement);

module.exports = router;