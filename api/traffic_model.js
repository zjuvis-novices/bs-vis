var dataModel       = require('./data_model');
var trafficData     = dataModel.trafficData;
var poiData         = dataModel.poiData;
var weatherData     = dataModel.weatherData;

// 4 -> 100, 3 -> 80, 2 -> 60, -1 -> 20, 1 -> 40
// Calculate the design speed of roads at POIs
var expectedSpeed = poiData.map((x) => x['road_level'])
                        .map((x) => {
                            switch(x) {
                                case 4: return 100;
                                case 3: return 80;
                                case 2: return 60;
                                case 1: return 40;
                                default: case -1: return 20; }});

// Calculate weekday
var index2Weekday = (index) => (Math.floor(index/24) + 6) % 7;

// The trafficIndex makes sure that the average is about 0.5
// and both the maximum and the minimum lay in the interval (0, 1)
var trafficIndex = trafficData.averageSpeed.map(
    (dailyList) => dailyList.map(
        (hourlyList) => hourlyList.map(
            (ele, i) => Math.pow(expectedSpeed[i]/ele/316., 1/7.5)
        )
    )
);

function getTrafficIndexByWeekday(weekday, hour) {
    var upperWeekday = weekday.toUpperCase();
    if(trafficData[upperWeekday] === undefined) return null;
    if(!(trafficData[upperWeekday] >= 0 && trafficData[upperWeekday] <= 6)) return null;
    weekdayIndex = trafficData[upperWeekday];
    // Not a valid hour
    if(!(hour >= 0 && hour < 24)) return null;
    return trafficIndex[weekdayIndex][hour];
}

function getTrafficIndexByDate() {
    var index;
    if(arguments.length === 1) {
        index = arguments[0];
    } else {
        index = weatherData.dateStr2Index(arguments[0], arguments[1]);
    }
    if(isNaN(index2Weekday(index))) return null;
    if(index >= weatherData.dataLength) return null;
    var hour = index % 24;
    if(trafficIndex[index2Weekday(index)][hour] === undefined)  return null;
    return trafficIndex[index2Weekday(index)][hour];
}

exports.index2Weekday               = index2Weekday;
exports.trafficIndex                = trafficIndex;
exports.getTrafficIndexByWeekday    = getTrafficIndexByWeekday;
exports.getTrafficIndexByDate       = getTrafficIndexByDate;