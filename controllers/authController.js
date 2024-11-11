// controllers/authController.js
const passport = require('passport');
const db = require('../config/db');
// Register function
// controllers/authController.js
exports.register = async (req, res, next) => {
    const { name, email, phone, password } = req.body; // Ensure you are extracting all necessary fields

    // Check for empty fields
    if (!name || !email || !phone || !password) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/register');
    }

    passport.authenticate('local-register', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/register');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Registration successful!');
            return res.redirect('/login');
        });
    })(req, res, next);
};

// Login function
exports.login = (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        if (err) {
            return next(err); // Pass errors to Express
        }
        if (!user) {
            return res.redirect('/login'); // Redirect back if login fails
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err); // Pass errors to Express
            }
            req.session.userId = user.id; 
            req.flash('success', 'Login successful!');
            return res.redirect('/dashboard'); 
        });
    })(req, res, next); // Call the authenticate function with the request and response
};

exports.logout = (req, res) => {
    req.logout(function(err) {
        if (err) {
            return next(err); // Pass error to error-handling middleware
        }
        req.flash('success', 'You have been logged out');
        res.redirect('/login');
    });
};


// controllers/authController.js

exports.profile = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    
    // Render the profile view with the logged-in user
    res.render('profile', { user: req.user });
};
// controllers/authController.js

// Display Edit Profile Form
exports.editProfile = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    // Pass the user to the view to populate the form
    res.render('edit-profile', { user: req.user });
};

 // Assumes `db` is set up to use MySQL connection

exports.updateProfile = (req, res) => {
  const { name, email, phone } = req.body;
  const userId = req.user.id; // Assumes `req.user.id` is set after authentication

  const sql = `UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?`;
  const values = [name, email, phone, userId];

  db.query(sql, values, (error, results) => {
    if (error) {
      return res.status(500).send(error.message);
    }
    res.redirect('/profile');
  });
};


