const express = require('express');
const heatHandler = require('./api/heat');
var app = express();

// Hostname
const hostname = 'localhost';
const port = 8080;

var path = '';

// Static pages
app.use(path, express.static('public'));

app.get(path + '/api/heat/:type/:date', heatHandler.getHeat);
app.get(path + '/api/counts.json', heatHandler.getCounts);
app.get(path + '/api/word-freq.json', heatHandler.getWordFreq);

var server = app.listen(port, () => {
    console.log('Server running at ' + hostname + ':' + port);
});
