const fs    = require('fs');// Traffic data model
var trafficData = {
    averageSpeed: [
      JSON.parse(fs.readFileSync('traffic_data/avespeed0.json')),
      JSON.parse(fs.readFileSync('traffic_data/avespeed1.json')),
      JSON.parse(fs.readFileSync('traffic_data/avespeed2.json')),
      JSON.parse(fs.readFileSync('traffic_data/avespeed3.json')),
      JSON.parse(fs.readFileSync('traffic_data/avespeed4.json')),
      JSON.parse(fs.readFileSync('traffic_data/avespeed5.json')),
      JSON.parse(fs.readFileSync('traffic_data/avespeed6.json'))
    ],
    density: [
      JSON.parse(fs.readFileSync('traffic_data/density0.json')),
      JSON.parse(fs.readFileSync('traffic_data/density1.json')),
      JSON.parse(fs.readFileSync('traffic_data/density2.json')),
      JSON.parse(fs.readFileSync('traffic_data/density3.json')),
      JSON.parse(fs.readFileSync('traffic_data/density4.json')),
      JSON.parse(fs.readFileSync('traffic_data/density5.json')),
      JSON.parse(fs.readFileSync('traffic_data/density6.json'))
    ],
    SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
    THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
    
    // This function returns an array of average traffic speed
    // at weekday, hour
    getSpeed(weekday, hour) {
      if(!(this[weekday] >= 0 && this[weekday] <= 6)) return null;
      weekdayIndex = this[weekday];
      // Not a valid hour
      if(!(hour >= 0 && hour < 24)) return null;
      return this.averageSpeed[weekdayIndex][hour];
    },

    // This function returns an array of traffic density
    // at weekday, hour
    getDensity(weekday, hour) {
      if(!(this[weekday] >= 0 && this[weekday] <= 6)) return null;
      weekdayIndex = this[weekday];
      // Not a valid hour
      if(!(hour >= 0 && hour < 24)) return null;
      return this.density[weekdayIndex][hour];
    }
};

// A list of POI (Place Of Interests) data
var poiData = JSON.parse(fs.readFileSync('traffic_data/poi_data.json'));

exports.trafficData = trafficData;
exports.poiData = poiData;