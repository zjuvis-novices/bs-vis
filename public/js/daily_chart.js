var dailyChart;
var dailyOptions = {
    color: [adColor, illegalColor, scamColor, otherColor],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: 'rgba(0,0,0,0.2)',
                width: 1,
                type: 'solid'
            }
        }
    },
    legend: {
        bottom: 10,
        right: 40,
        data: ['广告', '违法信息', '诈骗', '其他']
    },
    singleAxis: {
        top: 0,
        bottom: 100,
        axisTick: { inside: true,  },
        axisLabel: { interval: 1 },
        type: 'category',
        data: new Array(24).fill(0).map(function (val, i) { return i + ':00'; }),
        boundaryGap : false,
        axisPointer: {
            animation: true,
            label: {
                show: true
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed',
                opacity: 0.2
            }
        }
    },
    series: [
        {
            type: 'themeRiver',
            itemStyle: {
                emphasis: {
                    shadowBlur: 40,
                    shadowColor: 'rgba(0, 0, 0, 0.4)'
                }
            },
            data: [],
            label: {
                normal: { show: false }
            }
        }
    ]
}

function updateDailyData() {
    let c = getCurrentDay() * 24;
    let data = [];
    let srcData = spamCounts;
    data.push.apply(data,
        spamCounts['ad'].slice(c, c + 24)
            .map(function(val, i) { return [i, val, '广告']; }));
    data.push.apply(data,
        spamCounts['illegal'].slice(c, c + 24)
            .map(function(val, i) { return [i, val, '违法信息']; }));
    data.push.apply(data,
        spamCounts['scam'].slice(c, c + 24)
            .map(function(val, i) { return [i, val, '诈骗']; }));
    data.push.apply(data,
        spamCounts['others'].slice(c, c + 24)
            .map(function(val, i) { return [i, val, '其他']; }));
    dailyChart.setOption({ series: [{ data }] });
}

countsPromise = countsPromise.then(updateDailyData);
document.addEventListener('datechanged', updateDailyData);

$('#daily-container').promise().then(function() {
    dailyChart = echarts.init(document.getElementById('daily-container'));
    dailyChart.setOption(dailyOptions);
});
