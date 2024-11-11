// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin dashboard route
router.get('/dashboard', adminController.getAdminDashboard);

// Route to list users
router.get('/users', adminController.getAllUsers);

// Route to make a user admin
router.post('/make-admin/:id', adminController.makeAdmin);



// Route to delete a user
router.post('/delete-user/:id', adminController.deleteUser);

// Route to reset user password
router.post('/reset-password/:id', adminController.resetPassword);
// Example: Define the route in your server/router file
router.get('/user-food-data/:id', adminController.getUserFoodData);


module.exports = router;
