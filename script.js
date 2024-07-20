async function getWeather() {
    const apiKey = '253682c0bd759acfb4255d4aa08c3dd7';
    const city = document.getElementById('cityInput').value;
    const weatherResult = document.getElementById('weatherResult');
    const forecastResult = document.getElementById('forecastResult');
    weatherResult.innerHTML = '<div class="spinner"></div>';
    forecastResult.innerHTML = '';

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        if (data.cod === 200) {
            displayWeather(data);
            await getForecast(city, apiKey);
        } else {
            weatherResult.innerHTML = `<p>${data.message}</p>`;
        }
    } catch (error) {
        weatherResult.innerHTML = `<p>Error fetching weather data</p>`;
    }
}

async function getForecast(city, apiKey) {
    const forecastResult = document.getElementById('forecastResult');
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    if (data.cod === "200") {
        forecastResult.innerHTML = '<h2>5-Day Forecast</h2>';
        data.list.forEach(item => {
            const date = new Date(item.dt_txt);
            if (date.getHours() === 12) {
                forecastResult.innerHTML += `
                    <div>
                        <h3>${date.toDateString()}</h3>
                        <img class="weather-icon" src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                        <p>Temp: ${item.main.temp} °C</p>
                        <p>${item.weather[0].description}</p>
                    </div>
                `;
            }
        });
    } else {
        forecastResult.innerHTML = `<p>${data.message}</p>`;
    }
}

function displayWeather(data) {
    const weatherResult = document.getElementById('weatherResult');
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    weatherResult.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img class="weather-icon" src="${iconUrl}" alt="${data.weather[0].description}">
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity} %</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;

    document.body.style.backgroundImage = `url(${getBackgroundImage(data.weather[0].main)})`;
}

function getBackgroundImage(weather) {
    switch (weather.toLowerCase()) {
        case 'clear':
            return 'https://images.pexels.com/photos/2344227/pexels-photo-2344227.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';
        case 'clouds':
            return 'https://images.pexels.com/photos/414659/pexels-photo-414659.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';
        case 'rain':
            return 'https://images.pexels.com/photos/1463530/pexels-photo-1463530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';
        case 'snow':
            return 'https://images.pexels.com/photos/3334585/pexels-photo-3334585.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';
        default:
            return 'https://images.pexels.com/photos/5018196/pexels-photo-5018196.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';
    }
}
