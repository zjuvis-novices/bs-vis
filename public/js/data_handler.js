// ================ POI ================
var poiData = $.get('api/poi.json');

// dataDate is the date of currentVisualData
// currentVisualData is the current data
// it updates when a new date is picked on UI
var dataDate = new Date(epoch);
var currentVisualData = [];

// Update visual data and return a promise object
function updateVisualData() {
    console.log(dataDate);
    var promises = [];
    var dateString = dataDate.toLocaleDateString('zh', { year: 'numeric', month: '2-digit', day: '2-digit'});
    dateString = dateString.replace(/\//g, '-') + '-' + String(dataDate.getHours()).padStart(2, '0');
    function getVisualDataPromises(type) {
        return $.get('api/heat/' + type + '/' + dateString + '.json').done(function(data) {
            currentVisualData[type] = data.map(function(val) { return { lnglat: val, value: 1 } });
        });
    }
    promises = ['ad', 'illegal', 'scam', 'others'].map(getVisualDataPromises);
    return $.when.apply(this, promises);
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
