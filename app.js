const apiKey = 'bf822b324af1f823bcf808a183a5833c';
const lat = '39.8283';  // Latitude of Forked River, NJ
const lon = '-74.1993';  // Longitude of Forked River, NJ
const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&units=imperial&appid=${apiKey}`;

// Map of weather conditions to custom icons
const iconMap = {
    'Clear': 'clear.png',
    'Clouds': 'cloudy.png',
    'Rain': 'rain.png',
    'Snow': 'snow.png',
    'Thunderstorm': 'thunderstorm.png',
    'Drizzle': 'drizzle.png',
    'Mist': 'mist.png',
    'Haze': 'haze.png',
    'Broken Clouds': 'broken-clouds.png'
    // Add more mappings as needed for other weather conditions
};

async function fetchWeather() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayWeather(data.hourly);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayWeather(forecast) {
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = '';

    // Filter the forecast to only include 7 AM to 2 PM (7 hours)
    const filteredHours = forecast.filter(hour => {
        const date = new Date(hour.dt * 1000);
        const hourValue = date.getHours();
        return hourValue >= 7 && hourValue <= 14;  // Between 7 AM and 2 PM
    });

    filteredHours.slice(0, 7).forEach((hour) => {
        const weatherCard = document.createElement('div');
        weatherCard.classList.add('weather-card');

        const date = new Date(hour.dt * 1000).toLocaleTimeString('en-US', {
            hour: 'numeric',  // Show the hour (7 AM, 8 AM, etc.)
            hour12: true
        });

        // Get the weather description from the API
        const weatherDescription = hour.weather[0].main;  // E.g., 'Clear', 'Clouds', 'Rain'

        // Use your custom icons based on the weather description
        const customIcon = iconMap[weatherDescription] || 'default.png';  // Fallback to default icon

        const iconPath = `./images/icons/${customIcon}`;  // Path to the custom icon

        // Round the temperature and wind speed
        const roundedTemp = Math.round(hour.temp);
        const roundedWind = Math.round(hour.wind_speed);

        weatherCard.innerHTML = `
            <h3>${date}</h3>
            <img src="${iconPath}" alt="${weatherDescription}">
            <div class="weather-details">
                <p>${roundedTemp}°</p>
                <div class="humidity"><p> ${hour.humidity}%</p></div>
            </div>
        `;
       
        weatherContainer.appendChild(weatherCard);
    });
}

document.addEventListener('DOMContentLoaded', fetchWeather);
