// passport-setup.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Adjust path as necessary

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        const isMatch = await User.validatePassword(user, password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, email, password, done) => { // Change here
    const { name, phone, role = 'user' } = req.body;
    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return done(null, false, { message: 'Email is already in use.' });
        }

        const newUser = await User.register(name, email, phone,password, role);
        return done(null, newUser);
    } catch (err) {
        return done(err);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id); // Only store the user ID in the session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Adjust based on your database
        done(null, user);
    } catch (err) {
        done(err);
    }
});