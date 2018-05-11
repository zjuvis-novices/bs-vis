// Visualization
// Use function 'getCurrentIndex' to know the index of current hour
var radar;

$('#radar-container').promise().then(function() {
    radar = echarts.init(document.getElementById('radar-container'));
});

var currentdata = [];

radarOptions = {
    // title : {
    //     text: '情感分布',
    //     subtext: ''
    // },
    tooltip : {
        trigger: 'axis'
    },
    // legend: {
    //     orient : 'vertical',
    //     x : 'right',
    //     y : 'bottom',
    //     data:'情感分布'
    // },
    // toolbox: {
    //     show : true,
    //     feature : {
    //         mark : {show: true},
    //         dataView : {show: true, readOnly: false},
    //         restore : {show: true},
    //         saveAsImage : {show: true}
    //     }
    // },
    radar : [
        {
            indicator : [
                { text: '积极', max: 1},
                { text: '消极', max: 1},
                { text: '疲倦', max: 1},
            ],
            center: ['50%', '55%']
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

function updateradarData() {
    var index = getCurrentIndex();
    currentdata[0] = positiveByHour[index];
    currentdata[1] = negativeByHour[index];
    currentdata[2] = negativeByHour[index];
    radar.setOption(radarOptions);
}

// Binding callback
onTimeChangeCallbacks.updateradarData    = [];
onDateSelectionCallbacks.updateradarData = [];

// The initialization of data options should be delayed until the average
// data get requests are done.
getAverageData = getAverageData.done(function () {
    // Do initial data/option binding
    var index = getCurrentIndex();
    currentdata[0] = positiveByHour[index];
    currentdata[1] = negativeByHour[index];
    currentdata[2] = negativeByHour[index];
    radar.setOption(radarOptions);
});