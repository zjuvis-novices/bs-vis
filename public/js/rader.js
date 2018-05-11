// Visualization
// Use function 'getCurrentIndex' to know the index of current hour
var rader;
var positiveByHour = []
var negativeByHour = []
var tirednessByHour = []
$('#rader-container').promise().then(function() {
    rader = echarts.init(document.getElementById('rader-container'));
});

var currentdata = [];
// Example data
raderOptions = {
    title : {
        text: '情感分布',
        subtext: ''
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        orient : 'vertical',
        x : 'right',
        y : 'bottom',
        data:'情感分布'
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    polar : [
        {
            indicator : [
                { text: '积极（Positive）', max: 1},
                { text: '消极（Negative）', max: 1},
                { text: '疲惫（Tiredness）', max: 1},
            ]
        }
    ],
    calculable : true,
    series: [
        {
            name: '情感分布',
            type: 'radar',
            data:[
                {
                    value: currentdata,
                    name: '情感分布'
                }
                ]
        }
    ]

};

// This test function MUST stay in the global scope
// Note that this is only an example for test use
function testUpdateData() {
    var index = getCurrentIndex();
    currentdata[0] = positiveByHour[index];
    currentdata[1] = negativeByHour[index];
    currentdata[2] = negativeByHour[index];
    rader.setOption(raderOptions);
}

// Binding callback
onTimeChangeCallbacks.testUpdateData    = [];
onDateSelectionCallbacks.testUpdateData = [];

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
    console.log(positiveByHour)
    // Do initial data/option binding
    var index = getCurrentIndex();
    currentdata[0] = positiveByHour[index];
    currentdata[1] = negativeByHour[index];
    currentdata[2] = negativeByHour[index];
    rader.setOption(raderOptions);
});