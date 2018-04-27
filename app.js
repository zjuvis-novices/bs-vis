const express = require('express');
const requestHandler = require('./api/request_handler');
var app = express();

// Hostname
const hostname = 'localhost';
const port = 8080;

// Static pages
app.use(express.static('public'));

// API routing
// Traffic
app.get('/api/traffic/:type/:weekday/:hour', requestHandler.getTraffic);

// POI
app.get('/api/poi', requestHandler.getPOI);
app.get('/api/poi.*', requestHandler.getPOI);

// Weather
app.get('/api/weather/:type',  requestHandler.getWeather);

var server = app.listen(port, () => {
    console.log('Server running at ' + hostname + ':' + port);
});
