// Load current settings when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/settings'); // Fetch settings data from server
        if (response.ok) {
            const settingsData = await response.json();
            
            // Populate the settings form fields with the fetched data
            document.getElementById('chartType').value = settingsData.chartType;
            document.getElementById('caloriesColor').value = settingsData.caloriesColor;
            document.getElementById('proteinColor').value = settingsData.proteinColor;
            document.getElementById('carbsColor').value = settingsData.carbsColor;
            document.getElementById('fatsColor').value = settingsData.fatsColor;
        } else {
            console.error('Failed to load settings:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
});

// Event listener for form submission to save settings
document.getElementById('settingsForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent traditional form submission

    const chartType = document.getElementById('chartType').value;
    const caloriesColor = document.getElementById('caloriesColor').value;
    const proteinColor = document.getElementById('proteinColor').value;
    const carbsColor = document.getElementById('carbsColor').value;
    const fatsColor = document.getElementById('fatsColor').value;

    // Send settings data to the server
    try {
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chartType,
                caloriesColor,
                proteinColor,
                carbsColor,
                fatsColor
            })
        });

        if (response.ok) {
            alert('Settings saved!');
            window.location.href = '/dashboard'; // Redirect to the dashboard
        } else {
            console.error('Failed to save settings:', response.statusText);
        }
    } catch (error) {
        console.error('Error saving settings:', error);
    }
});
