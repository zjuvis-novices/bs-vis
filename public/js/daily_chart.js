var lineChart;
var lineOptions = {
    xAxis: {
        type: 'category',
        data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: "positive",
            data: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
            type: 'line'
        }
    ]

}

$('#line-container').promise().then(function() {
    lineChart = echarts.init(document.getElementById('line-container'));
}).then(function init() {
    // The initialization of data options should be delayed until the average
    // data get requests are done.
    getAverageData = getAverageData.done(function () {
        //TODO
        lineChart.setOption(lineOptions);
    });
});

function updateDate(){
    //TODO
}

onToggleLineCallbacks.updateDate = [];