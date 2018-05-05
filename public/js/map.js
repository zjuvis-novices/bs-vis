// Initialize AMap Loca
var map = new AMap.Map('container', {
    resizeEnable: true,
    zoom: 10,
    center:[120.2,30.25],
    mapStyle: 'amap://styles/grey'
});

var heatmap;
map.plugin(["AMap.Heatmap"], function() {
    //初始化heatmap对象
    heatmap = new AMap.Heatmap(map, {
        radius: 25, //给定半径
        opacity: [0, 0.8]
    });
});

function changedisplay() {
    if($("#displaytype").val() == 1)
    {
        heatmap.hide()
       // myChart.show()
    }
    else if($("#displaytype").val() == 2)
    {
        heatmap.show()
       // myChart.hide()
    }
}

function mapdisplay() {
    if(!$("#traffic").is(':checked')&&!$("#emotion").is(':checked')){
        heatmap.hide()
    }
}

var option = {
    //backgroundColor:'rgba(128, 128, 128, 0.1)',
    title: {
        text: "Scatter"
    },
    tooltip: {
        trigger: 'item',

    },
    legend: {
        orient: 'vertical',
        y: 'bottom',
        x:'right',
        //data:['speed'],
        textStyle: {
            color: '#fff'
        }
    },
    geo: {
        map: 'china',
        label: {
            emphasis: {
                show: false
            }
        },
        roam: true,
        itemStyle: {
            normal: {
                areaColor: '#323c48',
                borderColor: '#111'
            },
            emphasis: {
                areaColor: '#2a333d'
            }
        }
    },
    series : [
        {
            name: 'speed',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: [{
                name: 'aaaa',
                value: [104.37,31.13,19]
            }],
            symbolSize: function (val) {
                return val[2] / 10;
            },
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#ddb926'
                }
            }
        },

    ]
}
/*
var option = {
    backgroundColor:'rgba(128, 128, 128, 0.0)',
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
*/