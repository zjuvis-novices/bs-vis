var lineChart;
var dataSeries = {
    positive: {
        name: 'positive',
        color: positiveColor,
        data: [.2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.8,0,0,0,0,0,0,],
        type: 'line',
        areaStyle: {normal: {}}
    },
    negative: {
        name: 'negative',
        color: negativeColor,
        data: [.5,0,0,0,0,0,0,.1,0,0,0,.7,0,0,0,0,.5,0,0,0,0,0,],
        type: 'line',
        areaStyle: {normal: {}}
    },
    tiredness: {
        name: 'tiredness',
        color: tirednessColor,
        data: [1,0,0,0,0,.3,0,0,0,0,0,0.4,0,0,0,0,0,.3,0,0,0,0,],
        type: 'line',
        areaStyle: {normal: {}}
    }
};

var lineOptions = {
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
    console.log(data);
    console.log($.extend({}, lineOptions, {series: data}));
    lineChart.setOption(
        $.extend({}, lineOptions, {series: data}),
        {notMerge: true}
    );
}
onToggleLineCallbacks.updateLineEmotionOptions = [];

function updateLineData() {
    // TODO:
    
}
onDateSelectionCallbacks.updateLineData = [];

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

function updateDate(){
    //TODO
}

onToggleLineCallbacks.updateDate = [];