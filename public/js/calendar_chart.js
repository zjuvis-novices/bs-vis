var calendar;
var positiveByHour = [];
var negativeByHour = [];
var tirednessByHour = [];
// The initialization of data options should be delayed until the average
// data get requests are done.
$.when(
    positiveAverageGet,
    negativeAverageGet,
    tirednessAverageGet
).done(function () {
    // These data are only available when the initialization is done
    positiveByHour = positiveAverageGet.responseJSON;
    negativeByHour = negativeAverageGet.responseJSON;
    tirednessByHour = tirednessAverageGet.responseJSON;
    // Do initial data/option binding
    //calendar.setOption(calendarOptions);
});
