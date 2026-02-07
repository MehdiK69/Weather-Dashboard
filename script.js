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
    const savedData = localStorage.getItem('weatherData');
    if (savedData !== null) {
        const weatherData = JSON.parse(savedData);
        inputCity.value = weatherData.city;
        searchCity();
    }

    function searchCity() {
        
        const cityN = inputCity.value.trim();
        
        if(cityN === ''){
            cityName.textContent = "⚠️ Veuillez entrer un nom de ville";
            cityName.style.color = "red";
        } else {
            forecastList.innerHTML = '';
            const weatherData = {
                city : cityN,
                temperature : 25,
                description : "Ensoleillé",
                humidity : 60,
                wind : 15,
                pressure : 1013
            }
            const forecast = [
                { jour: "Lundi", temp: 23 },
                { jour: "Mardi", temp: 26 },
                { jour: "Mercredi", temp: 32 },
                { jour: "Jeudi", temp: 22 },
                { jour: "Vendredi", temp: 30 }
            ];
            cityName.textContent = `Météo pour ${weatherData.city}`;
            temperature.textContent = `${weatherData.temperature}°C`;
            description.textContent = weatherData.description;
            humidity.textContent = `Humidité : ${weatherData.humidity}%`;
            wind.textContent = `Vent : ${weatherData.wind} km/h`;
            pressure.textContent = `Pression : ${weatherData.pressure} hPa`;
            forecast.forEach(day => {
                forecastList.innerHTML += 
                    `<div class="forecast-day">${day.jour} - ${day.temp}°C</div>`;
            });
            localStorage.setItem('weatherData', JSON.stringify(weatherData));

        }
    }

    buttonSearch.addEventListener('click', searchCity);

    inputCity.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchCity();
        }
    });
}