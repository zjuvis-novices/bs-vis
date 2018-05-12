const jerzy         = require('jerzy');
var dataModel       = require('./data_model');
var trafficModel    = require('./traffic_model');
var trafficData     = dataModel.trafficData;
var poiData         = dataModel.poiData;
var weatherData     = dataModel.weatherData;

// Jerzy vector object
var vecTemperature  = new jerzy.Vector(weatherData.temperature);
var vecWindspeed    = new jerzy.Vector(weatherData.windspeed);
var vecSunlight     = new jerzy.Vector(weatherData.sunlight);

// Average weather data
var meanTemperature = vecTemperature.mean();
var meanWindspeed   = vecWindspeed.mean();
var meanSunlight    = vecSunlight.mean();
                
// Standard deviation
var sdTemperature   = vecTemperature.sd();
var sdWindspeed     = vecWindspeed.sd();
var sdSunlight      = vecSunlight.sd();

// Weather positive
var weatherPostive = Array.apply(null, Array(weatherData.dataLength))
                        .map((_, i) => (100. - weatherData.PPD(i))/100.);

// Normalize array to [0, 1]
function normalizeArray(array) {
    var max = array.reduce((a, b) => a > b ? a : b);
    var min = array.reduce((a, b) => a < b ? a : b);
    return array.map((x) => (x - min)/(max - min));
}

// Weather negative
var weatherNegative = Array.apply(null, Array(weatherData.dataLength))
                        .map((_, i) => {
                            // Standardlized variables
                            var stdTemperature  = (weatherData.temperature[i] - meanTemperature)/sdTemperature;
                            var stdSunlight     = (weatherData.sunlight[i] - meanSunlight)/sdSunlight;
                            var stdWindspeed    = (weatherData.windspeed[i] - meanWindspeed)/sdWindspeed;
                            // Daylight score:
                            // REF: (Denissen 2008)
                            if(weatherData.sunlight[i] !== 0.) {
                                return   (0.035 * stdTemperature
                                        - 0.023 * stdWindspeed
                                        - 0.023 * stdSunlight)
                                        / (0.035 - 0.023 - 0.023);
                            } else {
                                // Night score:
                                return   (0.035 * stdTemperature
                                        - 0.023 * stdWindspeed)
                                        / (0.035 - 0.023);
                            }});
// Standardlize negative
weatherNegative = normalizeArray(weatherNegative);

// Weather tiredness
var weatherTiredness = Array.apply(null, Array(weatherData.dataLength))
                            .map((_, i) => 
                                -(weatherData.sunlight[i] - meanSunlight)/sdSunlight);
// Standardlize tiredness
weatherTiredness = normalizeArray(weatherTiredness);

var weatherEmotion = {
    positive:   weatherPostive,
    negative:   weatherNegative,
    tiredness:  weatherTiredness
};

function getPositive() {
    var index;
    if(arguments.length === 1) {
        index = arguments[0];
    } else {
        index = weatherData.dateStr2Index(arguments[0], arguments[1]);
    }
    if(trafficModel.getTrafficIndexByDate(index) !== null)
        return trafficModel.getTrafficIndexByDate(index)
                .map((base) => Math.pow((1 - base), 2) * weatherPostive[index]);
    return null;
}

function getNegative() {
    var index;
    if(arguments.length === 1) {
        index = arguments[0];
    } else {
        index = weatherData.dateStr2Index(arguments[0], arguments[1]);
    }
    if(trafficModel.getTrafficIndexByDate(index) !== null)
        return trafficModel.getTrafficIndexByDate(index)
                .map((base) => base * weatherNegative[index]);
    return null;
}

function getTiredness() {
    var index;
    if(arguments.length === 1) {
        index = arguments[0];
    } else {
        index = weatherData.dateStr2Index(arguments[0], arguments[1]);
    }
    if(trafficModel.getTrafficIndexByDate(index) !== null)
        return trafficModel.getTrafficIndexByDate(index)
                .map((base) => base * weatherTiredness[index]);
    return null;
}

exports.weatherEmotion  = weatherEmotion;
exports.getPositive     = getPositive;
exports.getNegative     = getNegative;
exports.getTiredness    = getTiredness;