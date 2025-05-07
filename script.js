document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const cityElement = document.querySelector('.city');
    const dateElement = document.querySelector('.date');
    const weatherIcon = document.querySelector('.weather-icon img');
    const tempElement = document.querySelector('.temp');
    const descriptionElement = document.querySelector('.description');
    const feelsLikeElement = document.querySelector('.feels-like');
    const humidityElement = document.querySelector('.humidity');
    const windElement = document.querySelector('.wind');
    const unitElements = document.querySelectorAll('.unit');

    let currentUnit = 'c';
    let currentCity = 'London';

    // Initialize the app
    fetchWeather(currentCity);

    // Search button click event
    searchBtn.addEventListener('click', () => {
        const city = searchInput.value.trim();
        if (city) {
            currentCity = city;
            fetchWeather(city);
            searchInput.value = '';
        }
    });

    // Enter key press in search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = searchInput.value.trim();
            if (city) {
                currentCity = city;
                fetchWeather(city);
                searchInput.value = '';
            }
        }
    });

    // Unit toggle event
    unitElements.forEach(unit => {
        unit.addEventListener('click', () => {
            if (unit.textContent.toLowerCase() !== currentUnit) {
                currentUnit = unit.textContent.toLowerCase();
                unitElements.forEach(u => u.classList.remove('active'));
                unit.classList.add('active');
                fetchWeather(currentCity);
            }
        });
    });

    // Fetch weather data
    function fetchWeather(city) {
        const apiKey = 'fdd0691505ed48ba8f572521250705';
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data);
            })
            .catch(error => {
                alert(error.message);
                console.error('Error:', error);
            });
    }

    // Display weather data
    function displayWeather(data) {
        cityElement.textContent = data.location.name;
        dateElement.textContent = formatDate(data.location.localtime);
        weatherIcon.src = `https:${data.current.condition.icon}`;
        weatherIcon.alt = data.current.condition.text;
        
        tempElement.textContent = currentUnit === 'c' 
            ? `${Math.round(data.current.temp_c)}°` 
            : `${Math.round(data.current.temp_f)}°`;
            
        descriptionElement.textContent = data.current.condition.text;
        
        feelsLikeElement.textContent = currentUnit === 'c' 
            ? `${Math.round(data.current.feelslike_c)}°` 
            : `${Math.round(data.current.feelslike_f)}°`;
            
        humidityElement.textContent = `${data.current.humidity}%`;
        windElement.textContent = currentUnit === 'c' 
            ? `${data.current.wind_kph} km/h` 
            : `${data.current.wind_mph} mph`;
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    }
});