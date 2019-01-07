// ================ POI ================
var poiData = $.get('api/poi.json');

// dataDate is the date of currentVisualData
// currentVisualData is the current data
// it updates when a new date is picked on UI
var dailyData = [];
var currentVisualData = {};

// This function updates the daily data and returns a promise object
function getDailyData() {
    var promises = [];
    var dateString = currentDate.toLocaleDateString('zh', { year: 'numeric', month: '2-digit', day: '2-digit' });
    dateString = dateString.replace(/\//g, '-');
    function getDataPromise(type) {
        return function (hour) {
            return $.get('api/heat/' + type + '/' + dateString + '-' + String(hour).padStart(2, '0'))
                .done(function (data) {
                    if(!dailyData[hour]) { dailyData[hour] = {}; }
                    dailyData[hour][type] = data;
                });
        }
    }
    var functions = ['ad', 'illegal', 'scam', 'others'].map(getDataPromise);
    for(var i = 0; i < functions.length; i++) {
        var func = functions[i];
        var localPromises = new Array(24).fill(null).map(function (val, i) { return i; }).map(func);
        promises.push.apply(promises, localPromises);
    }
    return $.when.apply(this, promises).then(updateVisualData);
}

// Update visual data
function updateVisualData() {
    ['ad', 'illegal', 'scam', 'others']
        .forEach(function (type) {
            currentVisualData[type] = dailyData[currentHour][type]
                .map(function (lnglat) { return { lnglat: lnglat, value: 1 } });
        });
}

var positiveAverageGet  = $.get('api/emotion/positive/average.json');
var negativeAverageGet  = $.get('api/emotion/negative/average.json');
var tirednessAverageGet = $.get('api/emotion/tiredness/average.json');
var positiveByHour = [];
var negativeByHour = [];
var tirednessByHour = [];
var positiveByDay = [];
var negativeByDay = [];
var tirednessByDay = [];
var positiveCalendarData = [];
var negativeCalendarData = [];
var tirednessCalendarData = [];
var getAverageData = $.when(
    positiveAverageGet,
    negativeAverageGet,
    tirednessAverageGet
).done(function () {
    function byDay(byHour) {
        var result = [];
        for(var i = 0; i < byHour.length/24; i++) {
            result[i] = byHour.slice(i * 24, i * 24 + 24).reduce(function (a, b) { return a + b; })/24;
        }
        return result;
    }
    positiveByHour  = positiveAverageGet.responseJSON;
    negativeByHour  = negativeAverageGet.responseJSON;
    tirednessByHour = tirednessAverageGet.responseJSON;
    positiveByDay   = byDay(positiveByHour);
    negativeByDay   = byDay(negativeByHour);
    tirednessByDay = byDay(tirednessByHour);
});
