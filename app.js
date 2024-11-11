// app.js
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const calculatorRoute = require('./routes/calculator');
const trackerRoutes = require('./routes/trackerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Load environment variables
dotenv.config();

// Middleware to make `user` available in all views
app.use((req, res, next) => {
    res.locals.user = req.user || null; // Set user globally for access in views
    next();
});

// Passport and database setup
require('./config/passport-setup');
require('./config/db');

// Body parsing and JSON middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Set up session
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Ensure SESSION_SECRET is set in your .env
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global flash messages setup
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Set view engine
app.set('view engine', 'ejs');

// Route middlewares
app.use(authRoutes);
app.use('/calculator', calculatorRoute);
app.use(trackerRoutes);
app.use('/admin', adminRoutes);
app.use(settingsRoutes);

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Protected dashboard route (with isAuthenticated middleware)
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
});

// Settings page
app.get('/settings', isAuthenticated, (req, res) => {
    res.render('settings', { user: req.user });
});

// 404 Handling
app.use((req, res) => {
    res.status(404).render('404');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
