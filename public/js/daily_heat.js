var dailyHeat;
var punchData = { ad: [], illegal: [], scam: [], total: [] };

var heatOptions = {
    tooltip: {
        position: 'top'
    },
    visualMap: {
        min: 0,
        max: 25000,
        type: 'continuous',
        orient: 'horizontal',
        show: false,
        inRange: {}
    },
    grid: {
        width: '90%',
        height: '80%',
        x: '4%',
        y: '5%'
    },
    xAxis: {
        type: 'category',
        splitArea: {
            show: true
        }
    },
    yAxis: {
        type: 'category',
        data: new Array(24).fill(0).map(function (val, i) { return i; }),
        splitArea: {
            show: true
        }
    },
    dataZoom: [
        {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
        },
        {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'empty'
        },
        {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'empty'
        },
        {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'empty'
        }
    ],
    series: {
        name: '总计',
        type: 'heatmap',
        label: {
            normal: { show: false }
        },
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }
};

function updateHeatData() {
    switch ($('input[name="punch-radio"]:checked').val()) {
        case 'ad':
            heatOptions.series.name = '广告',
            heatOptions.series.data = punchData.ad;
            heatOptions.visualMap.inRange.color = [ '#FFFFFF', '#33D9F7', adColor ];
            heatOptions.visualMap.max = 6400;
            break;
            case 'illegal':
            heatOptions.series.name = '违法',
            heatOptions.series.data = punchData.illegal;
            heatOptions.visualMap.inRange.color = [ '#FFFFFF', '#FFCB8A', illegalColor ];
            heatOptions.visualMap.max = 17000;
            break;
            case 'scam':
            heatOptions.series.name = '诈骗',
            heatOptions.series.data = punchData.scam;
            heatOptions.visualMap.inRange.color = [ '#FFFFFF', '#D5697B', scamColor ];
            heatOptions.visualMap.max = 11000;
            break;
            case 'total':
            heatOptions.series.name = '总计',
            heatOptions.series.data = punchData.total;
            heatOptions.visualMap.inRange.color = [ '#FFFFFF', '#67E4A3', otherColor ];
            heatOptions.visualMap.max = 25000;
            break;
    }
    dailyHeat.setOption(heatOptions);
}

countsPromise = countsPromise.then(function () {
    var dateList = new Array(spamCounts.ad.length / 24).fill(0)
        .map(function (val, i) { return echarts.format.formatTime('yyyy-MM-dd',
            epoch.getTime() + 24 * 3600 * 1000 * i); } );
    heatOptions.xAxis.data = dateList;
    for (var i = 0; i < spamCounts.ad.length; i++) {
        var dayIndex = Math.floor(i / 24);
        var hourIndex = i % 24;
        var ad = punchData.ad[i] = [dayIndex, hourIndex, spamCounts.ad[i]];
        var illegal = punchData.illegal[i] = [dayIndex, hourIndex, spamCounts.illegal[i]];
        var scam = punchData.scam[i] = [dayIndex, hourIndex, spamCounts.scam[i]];
        punchData.total[i] = [dayIndex, hourIndex, ad[2] + illegal[2] + scam[2]];
    }
    updateHeatData();
});
$('input[name="punch-radio"]').change(updateHeatData);

$('#heat-container').promise().then(function() {
    dailyHeat = echarts.init(document.getElementById('heat-container'));
    dailyHeat.setOption(heatOptions);
});
