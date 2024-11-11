// routes/settingsRoutes.js

const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController'); // Import the controller
const { getChartData } = require('../controllers/chartController');
// Define routes
router.get('/api/settings', settingsController.getSettings); // Get user settings
router.post('/api/settings', settingsController.saveSettings); // Save user settings
router.get('/api/chartdata', getChartData);
module.exports = router;
