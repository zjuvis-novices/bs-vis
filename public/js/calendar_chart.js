var calendar;

$('#calendar-container').promise().then(function() {
    calendar = echarts.init(document.getElementById('calendar-container'));
});

getAverageData = getAverageData.done(function () {
    // These are ready to use:
    // positiveByHour
    // negativeByHour
    // tirednessByHour
    var option = {
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
            data: [
                ['2017-01-02', 900],
                ['2017-01-03', 877],
                ['2017-01-04', 629],
                ['2017-01-05', 129],
                ['2017-01-06', 399],
                ['2017-01-07', 649],
                ['2017-01-08', 29],
                ['2017-01-09', 329],
                ['2017-01-10', 127]
            ]
        }
    }
    calendar.setOption(option);
});


