var calendar;
$('#calendar-container').promise().then(function() {
    calendar = echarts.init(document.getElementById('calendar-container'));
});

var calendarOptions = {
    visualMap: {
        min: 0,
        max: 1,
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
        data: [['2017-7-02', 0.2], ['2017-07-03', 0.3], ['2017-07-04', 0.5]]
    }
}

function updateCalendarType() {
    // Here to update the calendar data and rendering
    console.log(currentCalendarType);
}

onToggleCalendarCallbacks.updateCalendarType = [];

// This function converts the index of days to date strings
function dayToDateString(index) {
    var indexDate = new Date(epoch.getTime() + index * 24 * 3600 * 1000);
    return dateString(indexDate);
}

getAverageData = getAverageData.done(function () {
    // These are ready to use:

    // positiveByDay
    // negativeByDay
    // tirednessByDay
    calendar.setOption(calendarOptions);
});





