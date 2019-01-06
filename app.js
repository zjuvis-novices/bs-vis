const express = require('express');
const requestHandler = require('./api/request_handler');
const heatHandler = require('./api/heat');
var app = express();

// Hostname
const hostname = 'localhost';
const port = 8080;

var path = '';

// Static pages
app.use(path, express.static('public'));

// API routing
// Traffic
app.get(path + '/api/traffic/:type/:weekday/:hour', requestHandler.getTraffic);

// POI
app.get(path + '/api/poi', requestHandler.getPOI);
app.get(path + '/api/poi.*', requestHandler.getPOI);

// Weather
app.get(path + '/api/weather/:type', requestHandler.getWeather);

// Emotion
app.get(path + '/api/emotion/:type/weather', requestHandler.getWeatherEmotion);
app.get(path + '/api/emotion/:type/weather.*', requestHandler.getWeatherEmotion);
app.get(path + '/api/emotion/:type/average', requestHandler.getAverage);
app.get(path + '/api/emotion/:type/average.*', requestHandler.getAverage);
app.get(path + '/api/emotion/:type/:date/:hour', requestHandler.getEmotionByDate);
app.get(path + '/api/emotion/:type/:index', requestHandler.getEmotionByIndex);

app.get(path + '/api/heat/:type/:date', heatHandler.getHeat);

var server = app.listen(port, () => {
    console.log('Server running at ' + hostname + ':' + port);
});
