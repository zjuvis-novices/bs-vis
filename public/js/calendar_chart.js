var calendar;
var calendarData = { ad: [], illegal: [], scam: [], total: [] };
var calendarOptions = {
    visualMap: {
        min: 0,
        max: 160000,
        top: 0,
        show: false,
        inRange: {
            color: adColor,
            opacity: [0.3, 1.0]
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
        left:   120,
        right:  100,
        range: ['2017-02-23', '2017-04-26'],
        yearLabel: { show: false }
    },
    series: {
        type: 'scatter',
        coordinateSystem: 'calendar',
        data: [],
        symbolSize: function (val) {
            return Math.pow(val[1]/10000, 0.3) * 10 + 4;
        }
    }
}

function updateCalendarData(){
    switch ($('input[name="calendar-radio"]:checked').val()) {
        case 'ad':
            calendarOptions.series.data = calendarData.ad;
            calendarOptions.visualMap.inRange.color = adColor;
            calendarOptions.visualMap.max = 35000;
            break;
            case 'illegal':
            calendarOptions.series.data = calendarData.illegal;
            calendarOptions.visualMap.inRange.color = illegalColor;
            calendarOptions.visualMap.max = 160000;
            break;
            case 'scam':
            calendarOptions.series.data = calendarData.scam;
            calendarOptions.visualMap.inRange.color = scamColor;
            calendarOptions.visualMap.max = 80000;
            break;
            case 'total':
            calendarOptions.series.data = calendarData.total;
            calendarOptions.visualMap.inRange.color = otherColor;
            calendarOptions.visualMap.max = 260000;
            break;
    }
    calendar.setOption(calendarOptions);
}

countsPromise = countsPromise.then(function () {
    for (var i = 0; i < spamCounts.ad.length / 24; i++) {
        var dateString = echarts.format.formatTime('yyyy-MM-dd', epoch.getTime() + i * 1000 * 3600 * 24);
        var ad = calendarData.ad[i] = [dateString, spamCounts.ad.slice(i * 24, (i + 1) * 24).reduce(function (a, b) { return a + b; })];
        var illegal = calendarData.illegal[i] = [dateString, spamCounts.illegal.slice(i * 24, (i + 1) * 24).reduce(function (a, b) { return a + b; })];
        var scam = calendarData.scam[i] = [dateString, spamCounts.scam.slice(i * 24, (i + 1) * 24).reduce(function (a, b) { return a + b; })];
        calendarData.total[i] = [ ad[0], ad[1] + illegal[1] + scam[1] ];
    }
    updateCalendarData();
});
$('input[name="calendar-radio"]').change(updateCalendarData);

$('#calendar-container').promise().then(function() {
    calendar = echarts.init(document.getElementById('calendar-container'));
    calendar.setOption(calendarOptions);
});
