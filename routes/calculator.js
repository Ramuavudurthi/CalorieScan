// routes/calculator.js
const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');

router.get('/', (req, res) => {
    res.render('calorieCalculator', { user: req.user }); // Pass user object
});

// Render the calorie calculator form
router.get('/', calculatorController.renderCalculatorForm);

// Handle form submission to fetch nutritional data
router.post('/calculate', calculatorController.handleCalculatorSubmission);

module.exports = router;
