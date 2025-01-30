let LAT: string;
let LON: string;
let APIKEY: string;
let API_BASE_URL: string;
let apiWeatherURL: string;
let apiForecastURL: string;

const ONE_DAY = 24 * 60 * 60 * 1000;

interface WeatherData {
    weather: { icon: string; description: string }[];
    main: { humidity: number; temp: number };
}

interface ForecastItem {
    dt_txt: string;
    weather: { icon: string; description: string }[];
}

async function initConfig(): Promise<void> {
    try {
        const response = await fetch('/api/config');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to load configuration: ${response.status} - ${errorText}`);
        }

        const config = await response.json();
        LAT = config.LAT;
        LON = config.LON;
        APIKEY = config.APIKEY;
        API_BASE_URL = config.API_BASE_URL;

        apiWeatherURL = `${API_BASE_URL}/weather?lat=${LAT}&lon=${LON}&appid=${APIKEY}&units=imperial`;
        apiForecastURL = `${API_BASE_URL}/forecast?lat=${LAT}&lon=${LON}&appid=${APIKEY}&units=imperial`;

        // Fetch both weather and forecast concurrently *after* config is loaded
        await Promise.all([fetchWeather(), fetchForecast()]);

    } catch (error) {
        console.error('Error loading configuration:', error);
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = "Error loading weather data. Please try again later.";
        }
    }
}

async function fetchWeather(): Promise<void> {
    try {
        const response = await fetch(apiWeatherURL);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const data: WeatherData = await response.json(); // Type the response
        displayWeather(data);
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

async function fetchForecast(): Promise<void> {
    try {
        const response = await fetch(apiForecastURL);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const data = await response.json();
        displayForecast(data.list);
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

function displayWeather(data: WeatherData): void {
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    const desc = data.weather[0].description;
    const humidity = data.main.humidity.toFixed(0);
    const temperature = data.main.temp.toFixed(0);

    const tempElement = document.getElementById("weather-temp");
    const descElement = document.getElementById("weather-desc");
    const iconElement = document.getElementById("weather-icon") as HTMLImageElement;
    const humElement = document.getElementById("weather-hum");

    if (tempElement && descElement && iconElement && humElement) {
        tempElement.textContent = `${temperature}° F`;
        descElement.textContent = desc;
        iconElement.src = iconsrc;
        humElement.textContent = `Humidity: ${humidity}%`;
    } else {
        console.error("One or more weather elements not found in the DOM.");
    }
}

function displayForecast(forecasts: ForecastItem[]): void {
    let dates: string[] = [];
    let mydate = new Date();

    for (let i = 0; i < 3; i++) {
        mydate = new Date(mydate.getTime() + ONE_DAY);
        let nextdate = mydate.toISOString().slice(0, 10);
        dates.push(nextdate);
    }

    let forecastIcon = dates.map(date =>
        forecasts
            .filter(x => x.dt_txt.startsWith(date) && x.dt_txt.endsWith("09:00:00"))
            .map(x => x.weather[0].icon)[0]
    );

    let forecastDescription = dates.map(date =>
        forecasts
            .filter(x => x.dt_txt.startsWith(date) && x.dt_txt.endsWith("09:00:00"))
            .map(x => x.weather[0].description)[0]
    );

    const weatherElt = document.querySelector(".forecast");

    if (weatherElt) {
        weatherElt.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            let newSection = document.createElement("div");
            newSection.innerHTML = `
                <h3>${dates[i]}</h3> 
                <p>${forecastDescription[i] || 'No data available'}</p>
                <img src="https://openweathermap.org/img/wn/${forecastIcon[i] || '01d'}.png" alt="Forecast icon">
            `;
            weatherElt.append(newSection);
        }
    } else {
        console.error("Forecast container element not found in the DOM.");
    }
}


// Initialize and fetch data when the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await initConfig(); // Call initConfig here
});
