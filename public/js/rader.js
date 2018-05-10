// Visualization
// Use function 'getCurrentIndex' to know the index of current hour
var rader;
$('#rader-container').promise().then(function() {
    rader = echarts.init(document.getElementById('rader-container'));
});

// Example data
raderOptions = {
    title: {
        text: 'ECharts 入门示例'
    },
    tooltip: {},
    legend: {
        data:['销量']
    },
    xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
};

// This test function MUST stay in the global scope
// Note that this is only an example for test use
function testUpdateData() {
    function generateRandomData() {
        var result = [];
        for(var i = 0; i < 6; i++) {
            result.push(Math.random());
        }
        return result;
    }
    raderOptions.series[0].data = generateRandomData();
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
    var positiveByHour = positiveAverageGet.responseJSON;
    var negativeByHour = negativeAverageGet.responseJSON;
    var tirednessByHour = tirednessAverageGet.responseJSON;

    // Do initial data/option binding
    rader.setOption(raderOptions);
});