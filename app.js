const express = require('express');
const requestHandler = require('./api/request_handler');
var app = express();

// Hostname
const hostname = 'localhost';
const port = 8080;

// Static pages
app.use(express.static('public'));

// API
// Traffic
app.get('/api/traffic', (req, res) => {
    requestHandler.handleTraffic(req, res);
});

// POI
app.get('/api/poi', (req, res) => {
    requestHandler.handlePOI(req, res);
});

var server = app.listen(port, () => {
    console.log('Server running at ' + hostname + ':' + port);
});
