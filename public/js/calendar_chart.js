var calendar;
var currentCalendarData  = [];
var calendarOptions = {
    visualMap: {
        min: 0,
        max: 1,
        top: 0,
        show: false,
        inRange: {
            color: positiveColor,
            opacity: [0.2, 1.0]
        },
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 10,
    },
    tooltip: {},
    calendar: {
        top:    20,
        bottom: 10,
        left:   80,
        right:  40,
        range: ['2017-07-01', '2017-12-31']
    },
    series: {
        type: 'scatter',
        coordinateSystem: 'calendar',
        data: [],
        symbolSize: function (val) {
            return Math.pow(val[1], 0.5) * 18;
        }
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

function updateCalendarData(){
    switch (currentCalendarType){
        case 'positive':
            currentCalendarData = positiveCalendarData;
            calendarOptions.visualMap.inRange.color = positiveColor;
            break;
        case 'negative':
            currentCalendarData = negativeCalendarData;
            calendarOptions.visualMap.inRange.color = negativeColor;
            break;
        case 'tiredness':
            currentCalendarData = tirednessCalendarData;
            calendarOptions.visualMap.inRange.color = tirednessColor;
            break;
    }
    calendarOptions.series.data = currentCalendarData;
    calendar.setOption(calendarOptions);
}

onToggleCalendarCallbacks.updateCalendarData = [];


// This function converts the index of days to date strings
function dayToDateString(index) {
    var indexDate = new Date(epoch.getTime() + index * 3600 * 1000);
    return dateString(indexDate);
}
