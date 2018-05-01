const url           = require('url');
var dataModel       = require('./data_model');
var trafficModel    = require('./traffic_model');
var emotionModel    = require('./emotion_model');

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
    } else if(type === 'index') {
        responseExpr = trafficModel.getTrafficIndexByWeekday(weekday, hour);
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
    if(type === 'pmv') {
        res.set({
            'Content-Type': 'application/json;charset=UTF-8',
            'Cache-Control': 'public, max-age=31557600'
        });
        res.end(JSON.stringify(
            Array.apply(null, Array(dataModel.weatherData.dataLength))
                .map(function(_, i) { return dataModel.weatherData.PMV(i); })
        ));
        return;
    }
    if(type === 'ppd') {
        res.set({
            'Content-Type': 'application/json;charset=UTF-8',
            'Cache-Control': 'public, max-age=31557600'
        });
        res.end(JSON.stringify(
            Array.apply(null, Array(dataModel.weatherData.dataLength))
                .map(function(_, i) { return dataModel.weatherData.PPD(i); })
        ));
        return;
    }
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

function getWeatherEmotion(req, res) {
    var type = req.params['type'];
    if(type && typeof type !== 'string') {
        res.statusCode = 404;
        res.end();
        return;
    }
    type = type.toLowerCase();
    var result;
    result = emotionModel.weatherEmotion[type];
    if(result === undefined) result = null;
    res.statusCode = 200;
    res.set({
        'Content-Type': 'application/json;charset=UTF-8',
        'Cache-Control': 'public, max-age=31557600'
    });
    res.end(JSON.stringify(result));
}

function getEmotionByDate(req, res) {
    var type = req.params['type'];
    var date = req.params['date'];
    var hour = req.params['hour'].split('.')[0];
    var result = null;
    switch(type.toLowerCase()) {
        case 'positive':
            result = emotionModel.getPositive(date, parseInt(hour));
            break;
        case 'negative':
            result = emotionModel.getNegative(date, parseInt(hour));
            break;
        case 'tiredness':
            result = emotionModel.getTiredness(date, parseInt(hour));
            break;
        default: break;
    }
    if(result === null) {
        res.statusCode = 404;
        res.end();
        return;
    } else {
        res.statusCode = 200;
        res.set({
            'Content-Type': 'application/json;charset=UTF-8',
            'Cache-Control': 'public, max-age=31557600'
        });
        res.end(JSON.stringify(result));
    }
}

function getEmotionByIndex(req, res) {
    var type = req.params['type'];
    var index = req.params['index'];
    var result = null;
    switch(type.toLowerCase()) {
        case 'positive':
            result = emotionModel.getPositive(index);
            break;
        case 'negative':
            result = emotionModel.getNegative(index);
            break;
        case 'tiredness':
            result = emotionModel.getTiredness(index);
            break;
        default: break;
    }
    if(result === null) {
        res.statusCode = 404;
        res.end();
        return;
    } else {
        res.statusCode = 200;
        res.set({
            'Content-Type': 'application/json;charset=UTF-8',
            'Cache-Control': 'public, max-age=31557600'
        });
        res.end(JSON.stringify(result));
    }
}

exports.getTraffic          = getTraffic;
exports.getPOI              = getPOI;
exports.getWeather          = getWeather;
exports.getWeatherEmotion   = getWeatherEmotion;
exports.getEmotionByDate    = getEmotionByDate;
exports.getEmotionByIndex   = getEmotionByIndex;