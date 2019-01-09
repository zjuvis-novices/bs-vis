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

// Get counts & word frequencies
var spamCounts = {};
var countsPromise = $.get('api/counts.json').done(function (data) { spamCounts = data; });
var wordFreqs = [];
var wordFreqPromise = $.get('api/word-freq.json').done(function (data) { wordFreqs = data; });
