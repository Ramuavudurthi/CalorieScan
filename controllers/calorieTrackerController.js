// controllers/calorieTrackerController.js
const db = require('../config/db');
const axios = require('axios');
require('dotenv').config();

const calculateNutrition = async (foodItem, weight) => {
    const appId = process.env.NUTRITIONIX_APP_ID;
    const appKey = process.env.NUTRITIONIX_API_KEY;

    try {
        const response = await axios.post(
            'https://trackapi.nutritionix.com/v2/natural/nutrients',
            { query: foodItem },
            {
                headers: {
                    'x-app-id': appId,
                    'x-app-key': appKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data && response.data.foods && response.data.foods.length > 0) {
            const nutritionData = response.data.foods[0];
            const baseWeight = nutritionData.serving_weight_grams;

            const calories = (nutritionData.nf_calories / baseWeight) * weight;
            const protein = (nutritionData.nf_protein / baseWeight) * weight;
            const carbs = (nutritionData.nf_total_carbohydrate / baseWeight) * weight;
            const fats = (nutritionData.nf_total_fat / baseWeight) * weight;

            return {
                calories: calories.toFixed(2),
                protein: protein.toFixed(2),
                carbs: carbs.toFixed(2),
                fats: fats.toFixed(2),
            };
        } else {
            throw new Error('No nutrition data found.');
        }
    } catch (error) {
        console.error('Error fetching nutrition data:', error);
        throw error;
    }
};

const addFoodEntry = async (req, res) => {
    const { foodItem, weight, date } = req.body;

    // Retrieve the logged-in user's ID from the session
    const userId = req.session.userId; // Adjust according to how you store user session data

    if (!userId) {
        return res.status(401).send('User not authenticated.'); // Handle unauthenticated user
    }

    try {
        const nutrition = await calculateNutrition(foodItem, weight);

        const sql = `
            INSERT INTO food_items (user_id, name, weight, calories, proteins, carbohydrates, fats, date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            userId,  // Include user_id in the values
            foodItem,
            weight,
            nutrition.calories,
            nutrition.protein,
            nutrition.carbs,
            nutrition.fats,
            date, 
        ];

        db.execute(sql, values, (err, result) => {
            if (err) {
                console.error('Database insert error:', err);
                res.status(500).send('Database error.');
                return;
            }
            res.redirect('/dashboard');
        });
    } catch (error) {
        res.status(500).send('An error occurred while processing the food entry.');
    }
};

// Function to get daily totals for nutrients
const getDailyTotals = async (req, res) => {
    const userId = req.session.userId; // Get user ID from session

    if (!userId) {
        return res.status(401).send('User not authenticated.');
    }

    try {
        const sql = `
            SELECT 
                SUM(calories) AS totalCalories, 
                SUM(proteins) AS totalProteins, 
                SUM(carbohydrates) AS totalCarbs, 
                SUM(fats) AS totalFats 
            FROM food_items 
            WHERE user_id = ? AND date = CURDATE()
        `;

        db.execute(sql, [userId], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Database error.');
            }

            const { totalCalories, totalProteins, totalCarbs, totalFats } = results[0] || {};

            // Pass totals to the dashboard view
            res.render('dashboard', {
                totalCalories: totalCalories || 0,
                totalProteins: totalProteins || 0,
                totalCarbs: totalCarbs || 0,
                totalFats: totalFats || 0
            });
        });
    } catch (error) {
        console.error('Error fetching daily totals:', error);
        res.status(500).send('An error occurred.');
    }
};
// Function to get daily nutritional totals for chart
const getDailyNutritionData = async (req, res) => {
    const userId = req.session.userId; // Get user ID from session

    if (!userId) {
        return res.status(401).send('User not authenticated.');
    }

    try {
        const sql = `
            SELECT 
                SUM(calories) AS totalCalories, 
                SUM(proteins) AS totalProteins, 
                SUM(carbohydrates) AS totalCarbs, 
                SUM(fats) AS totalFats 
            FROM food_items 
            WHERE user_id = ? AND date = CURDATE()
        `;

        db.execute(sql, [userId], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Database error.');
            }

            // Destructure the result to get total nutritional values
            const { totalCalories = 0, totalProteins = 0, totalCarbs = 0, totalFats = 0 } = results[0] || {};

            // Send nutritional data as JSON response
            res.json({
                calories: totalCalories, // Add total calories
                protein: totalProteins,
                carbohydrates: totalCarbs,
                fats: totalFats,
               
            });
        });
    } catch (error) {
        console.error('Error fetching daily nutrition data:', error);
        res.status(500).send('An error occurred.');
    }
};

const getUserData = async (req, res) => {
    const userId = req.session.userId; // Assuming user ID is stored in the session

    if (!userId) {
        return res.status(401).send('User not authenticated.');
    }

    try {
        const sql = `
            SELECT date, calories, proteins, carbohydrates, fats,name,weight
            FROM food_items
            WHERE user_id = ?
            ORDER BY date DESC
        `;

        db.execute(sql, [userId], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Database error.');
            }

            // Render the table view and pass user data to the view
            res.render('userDataTable', { foodData: results });
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('An error occurred.');
    }
};

// Export the function
module.exports = {
    addFoodEntry,
    getDailyTotals,
    getDailyNutritionData, // Ensure this line is included
    getUserData
};
