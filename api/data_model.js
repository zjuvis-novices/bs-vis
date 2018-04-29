const fs = require('fs');
const path = require('path');
const jerzy = require('jerzy');

var dir = path.basename(__dirname) + '/';

// Traffic data model
var trafficData = {
        averageSpeed: [
            JSON.parse(fs.readFileSync(dir + 'traffic_data/avespeed0.json')),
            JSON.parse(fs.readFileSync(dir + 'traffic_data/avespeed1.json')),
            JSON.parse(fs.readFileSync(dir + 'traffic_data/avespeed2.json')),
            JSON.parse(fs.readFileSync(dir + 'traffic_data/avespeed3.json')),
            JSON.parse(fs.readFileSync(dir + 'traffic_data/avespeed4.json')),
            JSON.parse(fs.readFileSync(dir + 'traffic_data/avespeed5.json')),
            JSON.parse(fs.readFileSync(dir + 'traffic_data/avespeed6.json'))
        ],
        density: [
            JSON.parse(fs.readFileSync(dir + 'traffic_data/density0.json')),
            JSON.parse(fs.readFileSync(dir + 'traffic_data/density1.json')),
            JSON.parse(fs.readFileSync(dir + 'traffic_data/density2.json')),
            JSON.parse(fs.readFileSync(dir + 'traffic_data/density3.json')),
            JSON.parse(fs.readFileSync(dir + 'traffic_data/density4.json')),
            JSON.parse(fs.readFileSync(dir + 'traffic_data/density5.json')),
            JSON.parse(fs.readFileSync(dir + 'traffic_data/density6.json'))
        ],
        SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
        THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
        
        // This function returns an array of average traffic speed
        // at weekday, hour
        getSpeed(weekday, hour) {
            var upperWeekday = weekday.toUpperCase();
            if(this[upperWeekday] === undefined) return null;
            if(!(this[upperWeekday] >= 0 && this[upperWeekday] <= 6)) return null;
            weekdayIndex = this[upperWeekday];
            // Not a valid hour
            if(!(hour >= 0 && hour < 24)) return null;
            return this.averageSpeed[weekdayIndex][hour];
        },

        // This function returns an array of traffic density
        // at weekday, hour
        getDensity(weekday, hour) {
            var upperWeekday = weekday.toUpperCase();
            if(this[upperWeekday] === undefined) return null
            if(!(this[upperWeekday] >= 0 && this[upperWeekday] <= 6)) return null;
            weekdayIndex = this[upperWeekday];
            // Not a valid hour
            if(!(hour >= 0 && hour < 24)) return null;
            return this.density[weekdayIndex][hour];
        }
};

// ISO 7730:2005(E)
// Predicted mean vote (PMV)
// REF:
// https://github.com/pieterprovoost/comfort/blob/master/lib/pmv.js
// Arguments:
//      m   -   Metabolic rate      (met)
//      w   -   External work       (met)
//      ta  -   Air temperature     (deg C)
//      tr  -   Mean radiant temp   (deg C)
//      icl -   thermal insulation  (clo)
//              of the clothing     icl (m^2 K/W) = 0.155 * clo, where clo is the clothing
//      va  -   air velocity        (m/s)
//      rh  -   relative humidity   (%)
function PMV(m, w, ta, tr, icl, va, rh) {
    // Conversion from relative humidity to saturated vapour pressure (kPa)
    var esat = (t) => {
        if(t < 0) {
            var a = 21.874; var b = 7.66;
        } else {
            var a = 18.269; var b = 35.86;
        }
        return 611 * Math.exp(a * t / (t + 273.15 - b)) /100;
    };

    // conversion from clothing to thermal insulation of the clothing m^2 K/W
    icl = icl * 0.155;
    // conversion from met to m^2 K/W
    m = m * 58.15; w = w * 58.15;
    this.m = m; this.w = w;
    // water vapour pressure ambient air
    var pa = rh * esat(ta);
    // clothing area factor
    if(icl > 0.078) {
        var fcl = 1.05 + 0.645 * icl;
    } else {
        var fcl = 1.00 + 1.290 * icl;
    }

    // skin temperature
    var ts = 35.7 - 0.028 * (m - w);
    this.ts             = ts;
    // saturated water vapour pressure at skin surface
    var ps = 256 * this.ts - 3373;
    // clothing temperature
    var tclf = (tcl) => {
        var tcle = ts - icl * (3.96 * 1e-8 * fcl * (Math.pow(tcl + 273, 4) - Math.pow(tr + 273, 4)) 
				+ fcl * Math.max(2.38 * Math.pow(Math.abs(tcl - ta), 0.25), 12.1 * Math.sqrt(va)) * (tcl - ta));
		return(tcl - tcle);
    };
    this.tcl            = jerzy.Numeric.secant(tclf, -50, 50);

	// convective heat transfer coefficient
	var hc = Math.max(2.38 * Math.pow(Math.abs(this.tcl - ta), 0.25), 12.1 * Math.sqrt(va));

	// heat balance
	this.diffusion      = - 3.05 * 1e-3 * (5733 - 6.99 * (m - w) - pa);
	this.sweat          = - 0.42 * (m - w - 58.15);
	this.evaporation    = this.diffusion + this.sweat;

	this.vapour         = - 1.7 * 1e-5 * m * (5867 - pa);
	this.temperature    = - 0.0014 * m * (34 - ta);
	this.respiration    = this.temperature + this.vapour;

	this.conduction     = - (this.ts - this.tcl) / icl;
	this.radiation      = - 3.96 * 1e-8 * fcl * (Math.pow(this.tcl + 273, 4) - Math.pow(tr + 273, 4));
	this.convection     = - fcl * hc * (this.tcl - ta);
	
	this.PMV            = (0.303 * Math.exp(-0.036 * m) + 0.028) * (m - w + this.evaporation + this.respiration + this.radiation + this.convection);
	this.PPD            = 100 - 95 * Math.exp(-0.03353 * Math.pow(this.pmv, 4) - 0.2179 * Math.pow(this.pmv, 2));

	this.balance        = this.m - this.w + this.radiation + this.convection + this.evaporation + this.respiration;
};

// A list of POI (Place Of Interests) data
var poiData = JSON.parse(fs.readFileSync(dir + 'traffic_data/poi_data.json'));

function weatherProto() {
    // Relative humidity in percentage * 100
    var humidity = this.humidity = JSON.parse(fs.readFileSync(dir + 'weather_data/humidity.json'));
    // Pressure in mbar, 1 mbar = 100 Pa
    var pressure = this.pressure = JSON.parse(fs.readFileSync(dir + 'weather_data/pressure.json'));
    // Sunlight data normalized
    var sunlight = this.sunlight = JSON.parse(fs.readFileSync(dir + 'weather_data/sunlight.json'));
    // Temperature in Celcius
    var temperature = this.temperature = JSON.parse(fs.readFileSync(dir + 'weather_data/temperature.json'));
    // Wind speed in km/h
    var windspeed = this.windspeed = JSON.parse(fs.readFileSync(dir + 'weather_data/wind.json'));

    // Epoch, 2017-7-1 00:00 (UTC+8)
    // Note that in Javascript, the index of month is the number of month - 1
    var epoch = this.epoch = new Date(2017, 6, 1, 0);
    // Data length
    var dataLength = this.dataLength = 4416;
    // This function maps the date string and hour to the index of weather
    // time series
    var dateStr2Index = this.dateStr2Index = (dateStr, hour) => {
        var dateObj = new Date(dateStr);
        dateObj.setHours(hour);
        // var epoch = new Date('2017-7-1');
        // epoch.setHours(0);
        return ((dateObj.valueOf() - epoch.valueOf())/3600000)|0;
    };
    // Get PWV object
    var getPWVObject = this.getPWVObject = (m, w, icl, dateStr, hour) => {
        var index = dateStr2Index(dateStr, hour);
        if(index >= dataLength || index < 0) return null;
        // In Celcius
        var temp = temperature[index];
        // In m/s
        var velocity = windspeed[index]/3.6;
        // In percentage * 100
        var rh = humidity[index] * 100;
        return new PMV(m, w, temp, temp, icl, velocity, rh);
    };
    var getPWV = this.getPWV = (m, w, icl, dateStr, hour) => {
        return getPWVObject(m, w, icl, dateStr, hour).PMV;
    };
    var getPPD = this.getPPD = (m, w, icl, dateStr, hour) => {
        return getPWVObject(m, w, icl, dateStr, hour).PPD;
    };
    // Metabolic rate definitions
    // See ISO 7730:2005 Annex B
    var reclineMetabolic    = this.reclineMetabolic = 0.8;
    var seatedMetabolic     = this.seatedMetabolic = 1.0;
    var sedentaryMetabolic  = this.sedentaryMetabolic = 1.2;
    var lightActMetabolic   = this.lightActMetabolic = 1.6;
    var medActMetabolic     = this.medActMetabolic = 2.0;
    var walk2kmphMetabolic  = this.walk2kmphMetabolic = 1.9;
    var walk3kmphMetabolic  = this.walk3kmphMetabolic = 2.4;
    var walk4kmphMetabolic  = this.walk4kmphMetabolic = 2.8;
    var walk5kmphMetabolic  = this.walk5kmphMetabolic = 3.4;
    // Thermal insulation definitions
    // See ISO 7730:2005 Annex C
    var lightClothing       = this.lightClothing = 0.5;
    var mediumClothing      = this.mediumClothing = 1.2;
    var heavyClothing       = this.heavyClothing = 2.6;
    // Assuming that people are clever enough
    // -30 deg -> 2.6
    //  35 deg -> 0.5
    var getClothing = this.getClothing = (temp) => {
        var result = -0.032 * temp + 1.62;
        if(result < 0.5) return 0.5;
        return result;
    };
    // Assuming that most people has a metabolic rate of 1.2 daily
    // And 0.9 at night, because so many people don't sleep at all!
    var getMetabolic = this.getMetabolic = (dateStr, hour) => {
        var index = dateStr2Index(dateStr, hour);
        if(index >= dataLength || index < 0) return null;
        if(sunlight[index] === 0.) {
            return 0.9;
        }
        return 1.2;
    };
    this.PWV = (dateStr, hour) => {
        var index = dateStr2Index(dateStr, hour);
        if(index >= dataLength || index < 0) return null;
        var temp = temperature[index];
        return getPWV(getMetabolic(dateStr, hour), 0, getClothing(temp),
                dateStr, hour);
    };
    this.PPD = (dateStr, hour) => {
        var index = dateStr2Index(dateStr, hour);
        if(index >= dataLength || index < 0) return null;
        var temp = temperature[index];
        return getPPD(getMetabolic(dateStr, hour), 0, getClothing(temp),
                dateStr, hour);
    };
}

exports.trafficData = trafficData;
exports.poiData = poiData;
exports.weatherData = new weatherProto();