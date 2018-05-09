// var globalDate = new Date()
// var currenttemp = null;
// var currentPPD = null;
// var temperaturedata = null;
// var PPDdata = null;
// var speeddata = [];
// var positivedata = [];
// var negativedata = [];
// var tirednessdata = [];
// var densitydata = null;
// var positive_raw = [];
// var negative_raw = [];
// var tiredness_raw = [];
// var pos = null;
// var neg = null;
// var tir = null;
// var show_emotion = {pos: false, neg: false, tir: false}

// ================ POI ================
var poiData = $.get('api/poi.json');


// ================ Temperature ================
// Temperature by hour used by the basic info
var getTemperatureByHour = $.get('api/weather/temperature.json');
var temperatureByHour;
function refreshHourlyTemperature() {
    $('#temperature-value').text(
        Math.round(temperatureByHour[getCurrentIndex()])
    );
};
// If the async ajax of requesting temperature by hour data is done,
// refresh the hourly temperature
// Binding callbacks
// Make sure that the function is called when the hour/date is changed
onTimeChangeCallbacks.refreshHourlyTemperature = [];
onDateSelectionCallbacks.refreshHourlyTemperature = [];
// The getTemperatureByHour promises this is to be done when the async get is done
getTemperatureByHour.done(function() {
    // Data returned from the server
    temperatureByHour = getTemperatureByHour.responseJSON;
    refreshHourlyTemperature();
});


// ================ PPD ================
// PPD by hour used by the basic info
var getPPDbyHour = $.get('api/weather/ppd.json');
var PPDbyHour;
function refreshHourlyPPD() {
    $('#ppd-value').text(
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
var dataDate = epoch;
var currentVisualData;

// Initialize currentVisualData
poiData = poiData.done(function(poiDataContent) {
    currentVisualData = poiDataContent.map(function (x) {
        return {
            'lnglat'        : x['location'],
            'positive'      : Array.from(new Array(24), function () {return null;}),
            'negative'      : Array.from(new Array(24), function () {return null;}),
            'tiredness'     : Array.from(new Array(24), function () {return null;}),
            'traffic'       : Array.from(new Array(24), function () {return null;})
        };
    });
    updateVisualData();
});

// Update visual data and returns a promise object
function updateVisualData() {
    var promises = [];
    if(dateString(dataDate) === dateString(currentDate)) {
        return $.when.apply(this, promises);
    }
    dataDate.setTime(currentDate.getTime());
    function getEmotion(emotion) {
        for(var i = 0; i < 24; i++) {
            (function (i) {
                var promise = $.get('api/emotion/' + emotion + '/' + dateString(dataDate) + '/' + i)
                    .done(function (dataContent) {
                        for(var index = 0; index < currentVisualData.length; index++) {
                            currentVisualData[index][emotion][i]
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
            var promise = $.get('api/traffic/speed/' + weekdays[dataDate.getDay()] + '/' + i)
                .done(function(dataContent) {
                    for(var index = 0; index < currentVisualData.length; index++) {
                        currentVisualData[index]['traffic'][i]
                            = dataContent[index];
                    }
                });
            promises.push(promise);
        } (i));
    }
    return $.when.apply(this, promises);
}

// //create emotion object
// function create_emotion(loc_list, color){
//     var result = [];
//     for(var i = 0; i < loc_list.length; i++)
//     {
//         result[i] = new AMap.Circle(
//             {center:new AMap.LngLat(loc_list[i][0],loc_list[i][1]),
//                 radius:loc_list[i][2],fillOpacity:0.2,strokeOpacity:0.3,
//                 strokeWeight:1,fillColor:color,strokeColor:color});
//     }
//     return result;
// }
// //deal with toggle action of emotion switches
// function toggle_emotion(emotion) {
//     if(show_emotion[emotion]){
//         show_emotion[emotion] = false;
//         for(var i=0; i<1856; i++)
//         {
//             eval(emotion+"[i].hide()")
//         }
//     }
//     else{
//         show_emotion[emotion] = true;
//         for(var i=0; i<1856; i++)
//         {
//             eval("console.log("+emotion+")")
//             console.log("!!!!")
//             eval(emotion+"[i].show()")
//         }
//     }
// }
// //refreshBubblemap
// function refreshBubblemap(){
//     refreshEmotionSet()
//     var positive = positive_raw.slice(1856*parseInt($("#hour").val()), 1856*parseInt($("#hour").val())+1856)
//    console.log(positive)
//     var negative = negative_raw.slice(1856*parseInt($("#hour").val()), 1856*parseInt($("#hour").val())+1856)
//     var tiredness = tiredness_raw.slice(1856*parseInt($("#hour").val()), 1856*parseInt($("#hour").val())+1856)
//     pos = create_emotion(positive, "#db4d6d")
//     neg = create_emotion(negative, "#3316b3")
//     tir = create_emotion(tiredness, "#f7d977")
//     console.log(pos)
//     for(var i = 0; i <1856; i++)
//     {
//         pos[i].setMap(map);
//         pos[i].show();
//         neg[i].setMap(map);
//         neg[i].show();
//         tir[i].setMap(map);
//         tir[i].hide();
//     }

//    // toggle_emotion('pos');
//     /*
//     toggle_emotion('neg');
//     toggle_emotion('tir');*/
// }

// // Time changing event
// function onTimeChange() {

//     $('#time-string').text($('#hour').val() + ':00');
//     //console.log(positivedata)
//     var currentdate = globalDate.getDate();
//     var deltahour = null;
//     switch (globalDate.getMonth())
//     {
//         case 6:
//             deltahour = (currentdate-1)*24;
//             break;
//         case 7:
//             deltahour = (currentdate+30)*24;
//             break;
//         case 8:
//             deltahour = (currentdate+61)*24;
//             break;
//         case 9:
//             deltahour = (currentdate+91)*24;
//             break;
//         case 10:
//             deltahour = (currentdate+122)*24;
//             break;
//         case 11:
//             deltahour = (currentdate+152)*24;
//             break;
//     }
//     var hour = parseInt($('#hour').val());
//     deltahour = deltahour+hour;
//     currenttemp = temperaturedata[deltahour];
//     currentPPD = parseInt(PPDdata[deltahour]);
//     $('#temperature-value').text(currenttemp);
//     $('#ppd-value').text(currentPPD);

//     if($("#displaytype").val() == 2)
//         refreshHeatmap();
//     else if($("#displaytype").val() == 1){
//         refreshBubblemap();
//     }

// }

// function refreshEmotionSet(){
//     positive_raw = [];
//     negative_raw = [];
//     tiredness_raw = [];
//     var tmp1 = [];
//     var tmp2 = [];
//     var tmp3 = [];
//     console.log(positivedata)
//     for(var i=0; i<1856*24; i++){
//         tmp1 = [];
//         tmp2= [];
//         tmp3 = [];
//         tmp1 = poiData[i%1856]["location"].concat(1000*positivedata[i])
//         tmp2 = poiData[i%1856]["location"].concat(1000*negativedata[i])
//         tmp3 = poiData[i%1856]["location"].concat(1000*tirednessdata[i])
//         positive_raw.push(tmp1)
//         negative_raw.push(tmp2)
//         tiredness_raw.push(tmp3)
//     }
//    // console.log(positive_raw)
// }

// function get(i, speeddata, weekday){
//     $.get('api/traffic/speed/'+weekday+'/'+i, function (data) {
//         speeddata = speeddata.concat(data);
//     })
// }

// //refreshHeatmap
// function refreshHeatmap(){
//     var heatmapdata = []
//     for(var i=0; i<1856; i++){
//         Poi = new Object();
//         //console.log(poiData[i]['location'][0])
//         Poi.lng = poiData[i]['location'][0];
//         Poi.lat = poiData[i]['location'][1];
//         if($("#traffic").is(':checked'))
//             Poi.count = speeddata[i+parseInt($('#hour').val())*24]
//         else if($("#emotion").is(':checked')){
//             if($("#positive").is(':checked')){
//                 Poi.count = 100*positivedata[i+parseInt($('#hour').val())*24]
//                // console.log("~")
//             }
//             else if($("#negative").is(':checked')){
//                 Poi.count = 100*negativedata[i+parseInt($('#hour').val())*24]
//             }
//             else if($("#tiredness").is(':checked')){
//                 Poi.count = 100*tirednessdata[i+parseInt($('#hour').val())*24]
//             }
//         }
//         heatmapdata.push(Poi);
//     }
//     console.log(heatmapdata)
//     heatmap.setDataSet({
//         data: heatmapdata,
//         max: 100
//     });
// }