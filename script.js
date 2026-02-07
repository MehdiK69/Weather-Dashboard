window.onload = main;

function main () {
    const inputCity = document.getElementById('cityInput');
    const buttonSearch = document.getElementById('searchBtn');
    const cityName = document.getElementById('cityName');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind');
    const pressure = document.getElementById('pressure');
    const forecastList = document.getElementById('forecast-list');
    const savedData = localStorage.getItem('lastCity');
    const resetApiBtn = document.getElementById('resetApiKey');
    if (resetApiBtn) {
        resetApiBtn.addEventListener('click', function() {
            localStorage.removeItem('api_key');
            alert('Clé API supprimée. Rechargez la page pour en entrer une nouvelle.');
        });
    }
    if (savedData !== null) {
        const weatherData = JSON.parse(savedData);
        inputCity.value = weatherData.name;
        searchCity();
    }

    async function searchCity() {
        
        
        const cityN = inputCity.value.trim();
        
        
        if(cityN === ''){
            cityName.textContent = "⚠️ Veuillez entrer un nom de ville";
            cityName.style.color = "red";
        } else {
             try {
                forecastList.innerHTML = '';
                const data = await getWeatherData(cityN);
                const forecast = await getForecastData(cityN);
                console.log(forecast); 
                // Vérifier si la ville existe
                if (data.cod === '404') {
                    cityName.textContent = "❌ Ville introuvable";
                    cityName.style.color = "red";
                    return;
                }
                cityName.textContent = `Météo pour ${data.name}`;
                temperature.textContent = `${Math.round(data.main.temp)}°C`;
                description.textContent = data.weather[0].description;
                humidity.textContent = `Humidité : ${data.main.humidity}%`;
                // OpenWeather renvoie m/s, conversion en km/h
                const windKmh = Math.round(data.wind.speed * 3.6);
                wind.textContent = `Vent : ${windKmh} km/h`;
                pressure.textContent = `Pression : ${data.main.pressure} hPa`;
                const dailyForecast = [
                    forecast.list[4],
                    forecast.list[12],
                    forecast.list[20],
                    forecast.list[28],
                    forecast.list[36]
                ];
                dailyForecast.forEach(day => {
                    const date = new Date(day.dt_txt);
                    const jour = date.toLocaleDateString('fr-FR', { weekday: 'long' });
                    forecastList.innerHTML += 
                        `<div class="forecast-day">${jour} - ${Math.round(day.main.temp)}°C - ${day.weather[0].description}</div>`;
                        
                });
                localStorage.setItem('lastCity', JSON.stringify(data));
            }catch (error){
                console.error(error);
                cityName.textContent = "❌ Erreur lors de la récupération des données";
                cityName.style.color = "red"; 
            }

        }
    }

function getApiKey() {
    let API_KEY = localStorage.getItem('api_key');
    if (!API_KEY) {
        alert('Pour utiliser cette application, vous avez besoin d\'une clé API OpenWeather gratuite.\n\n1. Créez un compte sur openweathermap.org\n2. Allez dans "API keys"\n3. Copiez votre clé');
        API_KEY = prompt('Entrez votre clé OpenWeather API :');
        if (API_KEY) {
            localStorage.setItem('api_key', API_KEY);
        }
    }
    return API_KEY;
}

    async function getWeatherData(city) {
        const API_KEY = getApiKey();
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`;
        
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    async function getForecastData(city) {
        const API_KEY = getApiKey();
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fr`;
        
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    buttonSearch.addEventListener('click', searchCity);

    inputCity.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchCity();
        }
    });
}