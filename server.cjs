const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/weather', (req, res) => {
  require('./dist/currentweather.js').getTheForecast().then((data) => {
    res.json(data);
  });
});

app.get('/forecast', (req, res) => {
  require('./dist/forecast.js').getTheForecast().then((data) => {
    res.json(data);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/static', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});