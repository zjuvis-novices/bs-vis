const url = require('url');
var dataModel = require('./data_model');

// This function maps the date string and hour to the index of weather
// time series
function dateStr2Index(dateStr, hour) {
    var dateObj = new Date(dateStr);
    dateObj.setHours(hour);
    var epoch = new Date('2017-7-1');
    epoch.setHours(0);
    return (dateObj.valueOf() - epoch.valueOf())/3600000;
}

function getTraffic(req, res) {
    // Get parameter list
    var responseExpr    = null;
    var type            = req.params['type'];
    var weekday         = req.params['weekday'];
    if(weekday) weekday = weekday.toUpperCase();
    var hour            = parseInt(req.params['hour'].split('.')[0]);
    if(type === 'speed') {
        responseExpr = dataModel.trafficData.getSpeed(weekday, hour);
    } else if(type === 'density') {
        responseExpr = dataModel.trafficData.getDensity(weekday, hour);
    }
    if(responseExpr === null) {
        res.statusCode = 404;
        res.end();
    } else {
        res.statusCode = 200;
        res.set({
            'Content-Type': 'application/json;charset=UTF-8',
            'Cache-Control': 'public, max-age=31557600'
        });
        res.end(JSON.stringify(responseExpr));
    }
}

function getPOI(req, res) {
    res.statusCode = 200;
    res.set({
        'Content-Type': 'application/json;charset=UTF-8',
        'Cache-Control': 'public, max-age=31557600'
    });
    res.end(JSON.stringify(dataModel.poiData));
}

function getWeather(req, res) {
    var type = req.params['type'];
    if(type && typeof type !== 'string') {
        res.statusCode = 404;
        res.end();
        return;
    }
    type = type.toLowerCase().split('.')[0];
    if(dataModel.weatherData[type] === undefined) {
        res.statusCode = 404;
        res.end();
        return;
    }
    res.statusCode = 200;
    res.set({
        'Content-Type': 'application/json;charset=UTF-8',
        'Cache-Control': 'public, max-age=31557600'
    });
    res.end(JSON.stringify(dataModel.weatherData[type]));
}

exports.getTraffic      = getTraffic;
exports.getPOI          = getPOI;
exports.getWeather      = getWeather;