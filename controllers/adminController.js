// controllers/adminController.js
const db = require('../config/db');
const bcrypt = require('bcrypt');
// Display the Admin Dashboard
exports.getAdminDashboard = (req, res) => {
    res.render('adminDashboard'); // Renders the main admin dashboard page
};

// Display all users
// Display all users
// Display all users with role 'user'
exports.getAllUsers = (req, res) => {
    const sql = `SELECT id, name, email, phone, role FROM users WHERE role = 'user'`; // Filter by role
    db.execute(sql, (err, results) => {
        if (err) return res.status(500).send('Database error');
        res.render('userList', { users: results });
    });
};



// Make user an admin
exports.makeAdmin = (req, res) => {
    const userId = req.params.id;
    const makeAdminSql = `UPDATE users SET role = 'admin' WHERE id = ?`;
    db.execute(makeAdminSql, [userId], (err) => {
        if (err) return res.status(500).send('Database error');
        res.redirect('/admin/users');
    });
};



// Delete a user
exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    const sql = `DELETE FROM users WHERE id = ?`;
    db.execute(sql, [userId], (err) => {
        if (err) return res.status(500).send('Database error');
        res.redirect('/admin/users');
    });
};

exports.resetPassword = (req, res) => {
    const userId = req.params.id;

    // Step 1: Retrieve the user's phone number
    const getUserPhoneSql = `SELECT phone FROM users WHERE id = ?`;
    db.execute(getUserPhoneSql, [userId], (err, results) => {
        if (err) return res.status(500).send('Database error');

        const userPhone = results[0]?.phone;
        if (!userPhone) return res.status(404).send('User phone not found');

        // Step 2: Hash the phone number to use as the new password
        bcrypt.hash(userPhone, 10, (err, hashedPassword) => {
            if (err) return res.status(500).send('Error hashing password');

            const resetPasswordSql = `UPDATE users SET password = ? WHERE id = ?`;
            db.execute(resetPasswordSql, [hashedPassword, userId], (err) => {
                if (err) return res.status(500).send('Database error');
                res.redirect('/admin/users');
            });
        });
    });
};

exports.getUserFoodData = async (req, res) => {
    const userId = req.params.userId;
    console.log("Received userId:", userId); // Debugging line

    try {
        const foodData = await db.execute(
            'SELECT name, weight, calories, proteins, carbohydrates, fats, date FROM food_items WHERE user_id = ?',
            [userId]
        );
        
        console.log("Food data from DB:", foodData); // To check the query result
        res.render('userFoodData', { foodData: foodData[0] }); // foodData[0] should contain the array of rows
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while retrieving food data');
    }
};


