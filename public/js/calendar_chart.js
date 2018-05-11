var calendar;
var currentCalendarData  = [];
var calendarOptions = {
    visualMap: {
        min: 0,
        max: 8,
        top: 0,
        show: true,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 10,
    },
    calendar: {
        top:    60,
        bottom: 10,
        left:   80,
        right:  40,
        range: ['2017-07-01', '2017-12-31']
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: [],
    }
}
$('#calendar-container').promise().then(function() {
    calendar = echarts.init(document.getElementById('calendar-container'));
}).then(function init() {
    getAverageData = getAverageData.done(function () {
        // Make the data initialization here!
        // ========
        // These are ready to use:
        // positiveByDay
        // negativeByDay
        // tirednessByDay
        var currentIndex = 0;
        var currentDateString = null;
        var tmpArray = [];
        for(var i=0; i<184; i++,currentIndex=currentIndex+24){
            currentDateString = dayToDateString(currentIndex)
            tmpArray.push(currentDateString);
            tmpArray.push(positiveByDay[i]);
            positiveCalendarData.push(tmpArray)
            tmpArray = [];
            tmpArray.push(currentDateString);
            tmpArray.push(negativeByDay[i]);
            negativeCalendarData.push(tmpArray)
            tmpArray = [];
            tmpArray.push(currentDateString);
            tmpArray.push(tirednessByDay[i]);
            tirednessCalendarData.push(tmpArray)
            tmpArray = [];
        }
        currentCalendarData = positiveCalendarData
        calendarOptions.series.data = currentCalendarData
        calendar.setOption(calendarOptions);
    });
});



function updateCalendarType() {
    // Here to update the calendar data and rendering
    console.log(currentCalendarType);
}

function updateCalendarData(){
    switch (currentCalendarType){
        case 'positive':    currentCalendarData = positiveCalendarData; break;
        case 'negative':    currentCalendarData = negativeCalendarData; break;
        case 'tiredness':   currentCalendarData = tirednessCalendarData; break;
    }
    calendarOptions.series.data = currentCalendarData
    //console.log(currentCalendarData)
    calendar.setOption(calendarOptions)
}

onToggleCalendarCallbacks.updateCalendarType = [];
onToggleCalendarCallbacks.updateCalendarData    = [];


// This function converts the index of days to date strings
function dayToDateString(index) {
    var indexDate = new Date(epoch.getTime() + index * 3600 * 1000);
    return dateString(indexDate);
}
