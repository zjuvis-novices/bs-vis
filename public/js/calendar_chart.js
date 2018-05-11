var calendar;
var positiveByDay = [];
var negativeByDay = [];
var tirednessByDay = [];
$('#calendar-container').promise().then(function() {
    calendar = echarts.init(document.getElementById('calendar-container'));
});

var calendarOptions = {
    visualMap: {
        show: false,
        min: 0,
        max: 10
    },
    calendar: {
        range: '2017'
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: []
    }
}

getAverageData = getAverageData.done(function () {
    // These are ready to use:
    // positiveByHour
    // negativeByHour
    // tirednessByHour
    
    calendar.setOption(calendarOptions);
});





