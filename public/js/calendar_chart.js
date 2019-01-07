var calendar;
var currentCalendarData  = [];
var calendarOptions = {
    visualMap: {
        min: 0,
        max: 1,
        top: 0,
        show: false,
        inRange: {
            color: adColor,
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

function updateCalendarData(){
    switch (currentCalendarType){
        case 'positive':
            currentCalendarData = positiveCalendarData;
            calendarOptions.visualMap.inRange.color = adColor;
            break;
        case 'negative':
            currentCalendarData = negativeCalendarData;
            calendarOptions.visualMap.inRange.color = illegalColor;
            break;
        case 'tiredness':
            currentCalendarData = tirednessCalendarData;
            calendarOptions.visualMap.inRange.color = scamColor;
            break;
    }
    calendarOptions.series.data = currentCalendarData;
    calendar.setOption(calendarOptions);
}

$('#calendar-container').promise().then(function() {
    calendar = echarts.init(document.getElementById('calendar-container'));
    calendar.setOption(calendarOptions);
});
