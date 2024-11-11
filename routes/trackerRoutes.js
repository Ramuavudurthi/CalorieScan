const express = require('express');
const calorieTrackerController = require('../controllers/calorieTrackerController'); // Import the whole controller
const router = express.Router();

// Authentication middleware
function ensureAuthenticated(req, res, next) {
    if (req.session.userId) return next();
    res.redirect('/login');
}

router.get('/tracker', (req, res) => {
    res.render('trackerForm');
});

router.post('/tracker', ensureAuthenticated, calorieTrackerController.addFoodEntry); // Use the full controller here
router.get('/dashboard', calorieTrackerController.getDailyTotals);
router.get('/daily-nutrition', calorieTrackerController.getDailyNutritionData);
router.get('/user-data', calorieTrackerController.getUserData);
module.exports = router;
