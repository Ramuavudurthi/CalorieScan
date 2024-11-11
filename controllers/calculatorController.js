// controllers/calculatorController.js
const axios = require('axios');
require('dotenv').config();

// Function to fetch nutritional data
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
            const baseWeight = nutritionData.serving_weight_grams; // Base weight from API

            // Scale nutrition info based on the user-provided weight
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
        throw new Error('An error occurred while fetching nutrition data: ' + (error.response?.data || error.message));
    }
};

// Controller method for rendering the calorie calculator form
const renderCalculatorForm = (req, res) => {
    res.render('calorieCalculator'); // Adjust to match your EJS filename
};

// Controller method for handling the form submission
const handleCalculatorSubmission = async (req, res) => {
    const { foodItem, weight } = req.body; // Capturing food item and weight from the form

    try {
        const nutrition = await calculateNutrition(foodItem, weight);
        res.render('calorieResult', {
            foodItem,
            weight,
            ...nutrition,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while fetching nutrition data.');
    }
};

module.exports = {
    renderCalculatorForm,
    handleCalculatorSubmission,
};
