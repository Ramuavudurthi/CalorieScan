// controllers/analyticsController.js
const axios = require('axios');
const db = require('../config/db'); // Ensure this is your database configuration
const FoodItem = require('../models/FoodItem'); // Import the FoodItem model

// Function to add food item
exports.addFoodItem = async (req, res) => {
    const { name, weight, date } = req.body;
    const userId = req.session.userId;

    try {
        // Replace with your actual API credentials
        const apiUrl = `https://api.nutritionix.com/v1_1/search/${name}?results=0:1&fields=item_name,nf_calories,nf_protein,nf_total_carbohydrate&appId=YOUR_APP_ID&appKey=YOUR_APP_KEY`;

        // Fetch nutritional information from the API
        const response = await axios.get(apiUrl);
        const food = response.data.hits[0].fields;

        // Calculate nutritional values based on weight
        const calories = (food.nf_calories * weight) / 100; // Assuming the API returns values per 100g
        const proteins = (food.nf_protein * weight) / 100;
        const carbohydrates = (food.nf_total_carbohydrate * weight) / 100;

        // Prepare the food item for storage
        const foodItem = {
            user_id: userId,
            name,
            weight,
            date,
            calories,
            proteins,
            carbohydrates
        };

        // Store the food item in the database
        FoodItem.add(foodItem, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving food item');
            }
            res.redirect('/analytics');
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error fetching nutritional data');
    }
};

// Function to get analytics for the logged-in user
exports.getAnalytics = async (req, res) => {
    const userId = req.session.userId;

    try {
        // Fetch food items for the logged-in user
        const foodItems = await FoodItem.getAllByUserId(userId); // Assuming you have this function

        // Prepare analytics data
        const analyticsData = {
            totalCalories: 0,
            totalProteins: 0,
            totalCarbohydrates: 0
        };

        foodItems.forEach(item => {
            analyticsData.totalCalories += item.calories;
            analyticsData.totalProteins += item.proteins;
            analyticsData.totalCarbohydrates += item.carbohydrates;
        });

        // Calculate averages or any other analytics as needed
        const averageCalories = analyticsData.totalCalories / foodItems.length || 0;
        const averageProteins = analyticsData.totalProteins / foodItems.length || 0;
        const averageCarbohydrates = analyticsData.totalCarbohydrates / foodItems.length || 0;

        // Render the analytics view with the data
        res.render('analytics', {
            analyticsData,
            averageCalories,
            averageProteins,
            averageCarbohydrates
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error fetching analytics data');
    }
};
