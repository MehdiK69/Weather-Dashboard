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
                wind.textContent = `Vent : ${data.wind.speed} km/h`;
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

    async function getWeatherData(city) {
        const API_KEY = 'VOTRE_CLE_API_ICI'; 
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`;
        
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    async function getForecastData(city) {
        const API_KEY = 'VOTRE_CLE_API_ICI'; 
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