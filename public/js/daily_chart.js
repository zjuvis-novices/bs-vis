var lineChart;
var dataSeries = {
    positive: {
        name: '正向',
        color: positiveColor,
        data: [.2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.8,0,0,0,0,0,0,],
        type: 'line',
        areaStyle: {normal: {}}
    },
    negative: {
        name: '负向',
        color: negativeColor,
        data: [.5,0,0,0,0,0,0,.1,0,0,0,.7,0,0,0,0,.5,0,0,0,0,0,],
        type: 'line',
        areaStyle: {normal: {}}
    },
    tiredness: {
        name: '疲惫',
        color: tirednessColor,
        data: [1,0,0,0,0,.3,0,0,0,0,0,0.4,0,0,0,0,0,.3,0,0,0,0,],
        type: 'line',
        areaStyle: {normal: {}}
    }
};

var lineOptions = {
    tooltip : {
        trigger: 'axis'
    },
    grid: {
        left:   '5px',
        right:  '5px',
        top:    '8px',
        bottom: '5px',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
    },
    yAxis: {
        type: 'value',
        max: 1, min: 0,
    }
}

function updateLineEmotionOptions() {
    var data = [];
    if(currentLineDisplay['positive'])
        data.push(dataSeries.positive);
    if(currentLineDisplay['negative'])
        data.push(dataSeries.negative);
    if(currentLineDisplay['tiredness'])
        data.push(dataSeries.tiredness);
    lineChart.setOption(
        $.extend({}, lineOptions, {series: data}),
        {notMerge: true}
    );
}
onToggleLineCallbacks.updateLineEmotionOptions = [];

function updateLineData() {
    var deltaDay = getCurrentDay()
    dataSeries.positive.data = positiveByHour.slice(deltaDay*24, deltaDay*24+24)
    dataSeries.negative.data = negativeByHour.slice(deltaDay*24, deltaDay*24+24)
    dataSeries.tiredness.data = tirednessByHour.slice(deltaDay*24, deltaDay*24+24)
    updateLineEmotionOptions();
}
// TODO: refactor this
// onDateSelectionCallbacks.updateLineData = [];

$('#line-container').promise().then(function() {
    updateLineDisplayStatus();
    lineChart = echarts.init(document.getElementById('line-container'));
}).then(function init() {
    // The initialization of data options should be delayed until the average
    // data get requests are done.
    getAverageData = getAverageData.done(function () {
        updateLineData();
        updateLineEmotionOptions();
    });
});

