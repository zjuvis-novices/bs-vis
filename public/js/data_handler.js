// ================ POI ================
var poiData = $.get('api/poi.json');

// ================ PPD ================
// PPD by hour used by the basic info
var getPPDbyHour = $.get('api/weather/ppd.json');
var PPDbyHour;
function refreshHourlyPPD() {
    $('.ppd-value').text(
        Math.round(PPDbyHour[getCurrentIndex()])
    );
};
// Binding callbacks
// Make sure that the function is called when the hour/date is changed
onTimeChangeCallbacks.refreshHourlyPPD = [];
onDateSelectionCallbacks.refreshHourlyPPD = [];
// Promise
getPPDbyHour.done(function() {
    PPDbyHour = getPPDbyHour.responseJSON;
    refreshHourlyPPD();
});


// ================ Emotion & Traffic ================
function dateString(date) {
    var year    = date.getFullYear();
    var month   = date.getMonth() + 1;
    var date    = date.getDate();
    return '' + year + '-' + month + '-' + date;
}

// structure of currentVisualData:
// currentVisualData = {
//          {
//              'lnglat'    : [120, 45],
//              'positive'  : [0.2, ... 24 objects],
//              'negative'  : [0.3, ... 24 objects],
//              'tiredness' : [0.7, ... 24 objects],
//              'traffic'   : [0.4, ... 24 objects]
//          }, ... 1000+ objects
// }
// dataDate is the date of currentVisualData
// currentVisualData is the current data
// it updates when a new date is picked on UI
var dataDate = new Date(epoch);
var currentVisualData;

// Initialize currentVisualData
poiData = poiData.done(function (poiDataContent) {
    currentVisualData = poiDataContent.map(function (x) {
        return new function () {
            this['lnglat'] = x['location'];
            this['name']   = x['name'];
            for(var i = 0; i < 24; i++) {
                this['positive' + i]    = Array.from(new Array(24), function () {return null;});
                this['negative' + i]    = Array.from(new Array(24), function () {return null;});
                this['tiredness' + i]   = Array.from(new Array(24), function () {return null;});
                this['traffic' + i]     = Array.from(new Array(24), function () {return null;});
            }
        };
        // return {
        //     'lnglat'        : x['location'],
        //     'positive'      : Array.from(new Array(24), function () {return null;}),
        //     'negative'      : Array.from(new Array(24), function () {return null;}),
        //     'tiredness'     : Array.from(new Array(24), function () {return null;}),
        //     'traffic'       : Array.from(new Array(24), function () {return null;})
        // };
    });
});

// Bind the updateVisualData method to 
onDateSelectionCallbacks.updateVisualData = [];
// Update visual data and return a promise object
function updateVisualData() {
    var promises = [];
    if(currentVisualData[0]['positive0'][0] !== null
        && dateString(dataDate) === dateString(currentDate)) {
        return $.when.apply(this, promises);
    }
    
    dataDate.setTime(currentDate.getTime());
    function getEmotion(emotion) {
        for(var i = 0; i < 24; i++) {
            (function (i) {
                var promise = $.get('api/emotion/' + emotion + '/' + dateString(dataDate) + '/' + i)
                    .done(function (dataContent) {
                        for(var index = 0; index < currentVisualData.length; index++) {
                            currentVisualData[index][emotion + i]
                                = dataContent[index];
                        }
                    });
                promises.push(promise);
            } (i));
        }
    }
    getEmotion('positive');
    getEmotion('negative');
    getEmotion('tiredness');
    var weekdays = ['sunday', 'monday', 'tuesday', 'wednesday',
        'thursday', 'friday', 'saturday'];
    for(var i = 0; i < 24; i++) {
        (function (i) {
            var promise = $.get('api/traffic/index/' + weekdays[dataDate.getDay()] + '/' + i)
                .done(function(dataContent) {
                    for(var index = 0; index < currentVisualData.length; index++) {
                        currentVisualData[index]['traffic' + i]
                            = dataContent[index];
                    }
                });
            promises.push(promise);
        } (i));
    }
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
