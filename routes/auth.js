// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController'); // Import your auth controller
const analyticsController = require('../controllers/analyticsController'); // Import your analytics controller


// Middleware to make `user` available globally
router.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Middleware functions
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.redirect('/'); // Redirect if not admin
}

// Render Registration Page
router.get('/register', (req, res) => {
    res.render('register', { error: req.flash('error')}); // Pass user object
});

// Render Login Page
router.get('/login', (req, res) => {
    res.render('login', { error: req.flash('error')}); // Pass user object
});

// Register Route
router.post('/register', authController.register);

// Login Route
router.post('/login', authController.login);

// Logout Route
router.get('/logout', authController.logout);

// Profile Route
router.get('/profile',isAuthenticated,authController.profile);

// // Admin-only route example
// router.get('/admin-dashboard', isAdmin, (req, res) => {
//     res.render('admin-dashboard');
// });

// Analytics Routes
router.get('/form', (req, res) => {
    res.render('form'); // Render food intake form
});
router.post('/add-food', analyticsController.addFoodItem); // Add food item
router.get('/analytics', analyticsController.getAnalytics); // View analytics

// Render Edit Profile Page
router.get('/profile/edit', isAuthenticated, authController.editProfile);

// Update Profile Route
router.post('/profile/edit', isAuthenticated, authController.updateProfile);

module.exports = router;

