// controllers/settingsController.js

const db = require('../config/db'); // Your database connection

// Get settings
exports.getSettings = (req, res) => {
    const userId = req.user.id;

    const query = 'SELECT * FROM UserSettings WHERE user_id = ?';
    db.query(query, [userId], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error fetching settings' });
            return;
        }

        if (results.length === 0) {
            res.json(null); // No settings found for user
        } else {
            res.json(results[0]); // Send the first result as user settings
        }
    });
};

// Save or update settings
exports.saveSettings = (req, res) => {
    const userId = req.user.id;
    const { chartType, caloriesColor, proteinColor, carbsColor, fatsColor } = req.body;
    console.log('Request Body:', req.body);
    const query = `
        INSERT INTO UserSettings (user_id, chart_type, calories_color, protein_color, carbs_color, fats_color)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            chart_type = VALUES(chart_type),
            calories_color = VALUES(calories_color),
            protein_color = VALUES(protein_color),
            carbs_color = VALUES(carbs_color),
            fats_color = VALUES(fats_color)
    `;

    db.query(query, [userId, chartType, caloriesColor, proteinColor, carbsColor, fatsColor], (error) => {
        if (error) {
            res.status(500).json({ message: 'Error saving settings' });
            return;
        }

        res.json({ message: 'Settings saved!' });
    });
};
