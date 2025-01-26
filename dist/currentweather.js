var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
dotenv.config();
const LAT = process.env.LOCATION_LAT || '';
const LON = process.env.LOCATION_LON || '';
const APIKEY = process.env.WEATHER_API_KEY || '';
const API_BASE_URL = process.env.API_BASE_URL || '';
const apiWeatherURL = `${API_BASE_URL}/weather?lat=${LAT}&lon=${LON}&appid=${APIKEY}&units=imperial`;
const apiForecastURL = `${API_BASE_URL}/forecast?lat=${LAT}&lon=${LON}&appid=${APIKEY}&units=imperial`;
// Function to display current weather
function displayWeather(data) {
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    const desc = data.weather[0].description;
    const humidity = data.main.humidity.toFixed(0);
    const temperature = data.main.temp.toFixed(0);
    const tempElement = document.getElementById("weather-temp");
    const descElement = document.getElementById("weather-desc");
    const iconElement = document.getElementById("weather-icon");
    const humElement = document.getElementById("weather-hum");
    if (tempElement && descElement && iconElement && humElement) {
        tempElement.textContent = `${temperature}° F`;
        descElement.textContent = desc;
        iconElement.src = iconsrc;
        humElement.textContent = `humidity: ${humidity}%`;
    }
    else {
        console.error("One or more weather elements not found in the DOM.");
    }
}
const ONE_DAY = 24 * 60 * 60 * 1000;
// Function to display forecast
function displayForecast(forecasts) {
    let dates = [];
    let mydate = new Date();
    for (let i = 0; i < 3; i++) {
        mydate = new Date(mydate.getTime() + ONE_DAY);
        let nextdate = mydate.toISOString().slice(0, 10);
        dates.push(nextdate);
    }
    let forecastIcon = dates.map((date) => forecasts
        .filter((x) => x.dt_txt.startsWith(date) && x.dt_txt.endsWith("09:00:00"))
        .map((x) => x.weather[0].icon)[0]);
    let forecastDescription = dates.map((date) => forecasts
        .filter((x) => x.dt_txt.startsWith(date) && x.dt_txt.endsWith("09:00:00"))
        .map((x) => x.weather[0].description)[0]);
    const weatherElt = document.querySelector(".forecast");
    if (weatherElt) {
        for (let i = 0; i < 3; i++) {
            let newSection = document.createElement("div");
            newSection.innerHTML = `<h3>${dates[i]}</h3> 
        <p>${forecastDescription[i]}</p>
        <img id="forecast-icon" src="https://openweathermap.org/img/wn/${forecastIcon[i]}.png" alt="icon image depicting forecast" >`;
            weatherElt.append(newSection);
        }
    }
    else {
        console.error("Forecast container element not found in the DOM.");
    }
}
// Fetch forecast data
function fetchForecast() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(apiForecastURL);
            if (response.ok) {
                const data = yield response.json();
                displayForecast(data.list);
            }
            else {
                throw new Error(yield response.text());
            }
        }
        catch (error) {
            console.error("Error fetching forecast:", error);
        }
    });
}
// Fetch current weather data
function fetchWeather() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(apiWeatherURL);
            if (response.ok) {
                const data = yield response.json();
                displayWeather(data);
            }
            else {
                throw new Error(yield response.text());
            }
        }
        catch (error) {
            console.error("Error fetching weather:", error);
        }
    });
}
export function getTheForecast() {
    fetchForecast();
    fetchWeather();
}
