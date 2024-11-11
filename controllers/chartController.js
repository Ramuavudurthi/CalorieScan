// controllers/chartController.js

const db = require('../config/db'); // Adjust the path based on your setup

const getChartData = (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const userId = req.user.id; // Assuming you have user authentication

    // Query to fetch food items for today
    const query = `
        SELECT food_item, calories, protein, carbs, fats 
        FROM food_items 
        WHERE user_id = ? AND DATE(date) = ?
    `;

    db.query(query, [userId, today], (error, results) => {
        if (error) {
            console.error('Error fetching food items:', error);
            return res.status(500).json({ message: 'Error fetching food items', error: error.message });
        }

        // Check if there are any results
        if (results.length === 0) {
            // No data found for today, return default donut chart data
            const defaultChartData = {
                labels: ['Protein', 'Carbs', 'Fats'],
                datasets: [{
                    label: 'Default Nutritional Data',
                    data: [0, 0, 0], // Default values for Protein, Carbs, and Fats
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    hoverOffset: 4,
                }],
                type: 'doughnut', // Specify that it's a donut chart
            };
            return res.json(defaultChartData);
        }

        // Process the results to create chart data
        const chartData = {
            labels: results.map(item => item.food_item), // Food item names as labels
            datasets: [{
                label: 'Nutritional Data',
                data: results.map(item => item.calories), // Calories data
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Use your desired colors
                hoverOffset: 4,
            }],
            type: 'doughnut', // Specify that it's a donut chart
        };

        res.json(chartData);
    });
};

module.exports = {
    getChartData,
};
