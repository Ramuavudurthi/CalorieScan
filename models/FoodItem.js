// models/FoodItem.js
const db = require('../config/db');

const FoodItem = {
    // Add a new food item to the database
    add: (foodItem, callback) => {
        const { user_id, name, weight, date, calories, proteins, carbohydrates } = foodItem;
        const sql = 'INSERT INTO food_items (user_id, name, weight, date, calories, proteins, carbohydrates,fats) VALUES (?, ?, ?, ?, ?, ?, ?,?)';
        
        db.query(sql, [user_id, name, weight, date, calories, proteins, carbohydrates], (err, result) => {
            if (err) {
                console.error('Error adding food item:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },
    
    // Get analytics for a user within a date range
    getAnalytics: (userId, startDate, endDate, callback) => {
        const sql = 'SELECT DATE(date) AS date, SUM(calories) AS totalCalories, SUM(proteins) AS totalProteins, SUM(carbohydrates) AS totalCarbohydrates FROM food_items WHERE user_id = ? AND date BETWEEN ? AND ? GROUP BY DATE(date)';
        
        db.query(sql, [userId, startDate, endDate], (err, results) => {
            if (err) {
                console.error('Error fetching analytics:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },

    // Get a food item by its ID
    getFoodItemById: (id, callback) => {
        const sql = 'SELECT * FROM food_items WHERE id = ?';
        
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error('Error fetching food item by ID:', err);
                return callback(err);
            }
            callback(null, results[0]); // Return the first result
        });
    },

    // Optional: Update a food item by ID
    updateById: (id, foodItem, callback) => {
        const { name, weight, date, calories, proteins, carbohydrates } = foodItem;
        const sql = 'UPDATE food_items SET name = ?, weight = ?, date = ?, calories = ?, proteins = ?, carbohydrates = ?, fats = ? WHERE id = ?';
        
        db.query(sql, [name, weight, date, calories, proteins, carbohydrates, id], (err, result) => {
            if (err) {
                console.error('Error updating food item:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },

    // Optional: Delete a food item by ID
    deleteById: (id, callback) => {
        const sql = 'DELETE FROM food_items WHERE id = ?';
        
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting food item:', err);
                return callback(err);
            }
            callback(null, result);
        });
    }
};

module.exports = FoodItem;
