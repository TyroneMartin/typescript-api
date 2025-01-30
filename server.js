const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// app.get('/api/config', (req, res) => {
//   res.json({
//     LAT: process.env.LOCATION_LAT,
//     LON: process.env.LOCATION_LON,
//     APIKEY: process.env.WEATHER_API_KEY,
//     API_BASE_URL: process.env.API_BASE_URL
//   });
// });

app.get('/api/config', (req, res) => {
  console.log("Environment Variables Loaded:");  // debugging
  console.log("LAT:", process.env.LOCATION_LAT);
  console.log("LON:", process.env.LOCATION_LON);
  console.log("APIKEY:", process.env.WEATHER_API_KEY);
  console.log("API_BASE_URL:", process.env.API_BASE_URL);

  if (!process.env.LOCATION_LAT || !process.env.LOCATION_LON || !process.env.WEATHER_API_KEY || !process.env.API_BASE_URL) {
    return res.status(500).json({ error: "Missing or incomplete environment variables." });
  }

  res.json({
    LAT: process.env.LOCATION_LAT,
    LON: process.env.LOCATION_LON,
    APIKEY: process.env.WEATHER_API_KEY,
    API_BASE_URL: process.env.API_BASE_URL
  });
});

app.get('/weather', async (req, res) => {
  try {
    const currentWeather = require('./dist/currentweather.js');
    const data = await currentWeather.getTheForecast();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get weather data' });
  }
});

app.get('/forecast', async (req, res) => {
  try {
    const forecast = require('./dist/forecast.js');
    const data = await forecast.getTheForecast();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get forecast data' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/static', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});