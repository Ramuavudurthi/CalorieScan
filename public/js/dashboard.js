document.addEventListener('DOMContentLoaded', async () => {
    const ctx = document.getElementById('nutritionChart').getContext('2d');

    let chartType = 'doughnut'; // Default chart type
    let colors = {
        calories: 'rgba(255, 206, 86, 0.7)', // Default colors
        protein: 'rgba(34, 197, 94, 0.7)',
        carbs: 'rgba(54, 162, 235, 0.7)',
        fats: 'rgba(255, 99, 132, 0.7)',
    };

    // Fetch settings for chart type and colors
    try {
        const response = await fetch('/api/settings');
        if (response.ok) {
            const settings = await response.json();
            // Apply user settings if available
            chartType = settings?.chart_type || chartType;
            colors.calories = settings?.calories_color || colors.calories;
            colors.protein = settings?.protein_color || colors.protein;
            colors.carbs = settings?.carbs_color || colors.carbs;
            colors.fats = settings?.fats_color || colors.fats;
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
    }

    // Fetch daily nutrition data
    const nutritionResponse = await fetch('/daily-nutrition');
    const nutritionData = await nutritionResponse.json();

    // Prepare chart data
    const chartData = [
        nutritionData.calories || 0,
        nutritionData.protein || 0,
        nutritionData.carbohydrates || 0,
        nutritionData.fats || 0
    ];

    // Check if data is empty
    const isDataEmpty = chartData.every(value => value === 0);

    // Prepare data for chart based on whether it's empty or not
    const dataForChart = isDataEmpty ? [1] : chartData; // Show one slice if empty
    const backgroundColors = isDataEmpty ? ['rgba(255, 206, 86, 0.7)'] : [
        colors.calories,
        colors.protein,
        colors.carbs,
        colors.fats,
    ];
    const borderColors = isDataEmpty ? ['rgba(255, 206, 86, 1)'] : [
        colors.calories.replace('0.7', '1'),
        colors.protein.replace('0.7', '1'),
        colors.carbs.replace('0.7', '1'),
        colors.fats.replace('0.7', '1'),
    ];

    // Create the chart
    const nutritionChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: isDataEmpty ? ['No Data'] : ['Calories', 'Protein', 'Carbohydrates', 'Fats'],
            datasets: [{
                label: 'Daily Nutritional Intake',
                data: dataForChart,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return isDataEmpty 
                                ? 'No Data' 
                                : `${context.label}: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
});
