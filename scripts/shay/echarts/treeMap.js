var myChart = echarts.init(document.getElementById('treeMap'));

myChart.showLoading();
data = [{
    "name": "诈骗",            
    "value": 538381,
    "path": "诈骗",
    "children": [{
        "name": "中奖诈骗",       
        "value": 1598,
        "path": "诈骗/中奖诈骗"
    }, {
        "name": "信用卡诈骗",       
        "value": 17527,
        "path": "诈骗/信用卡诈骗"
    }, {
        "name": "虚假红包",
        "value": 917,
        "path": "诈骗/虚假红包"
    }, {
        "name": "钓鱼网站",
        "value": 518339,
        "path": "诈骗/钓鱼网站"
    }]
}, {
    "name": "非法服务",            
    "value": 2166629,
    "path": "非法服务",
    "children": [{
        "name": "代开发票",       
        "value": 1831662,
        "path": "非法服务/代开发票"
    }, {
        "name": "办证刻章",
        "value": 25627,
        "path": "非法服务/办证刻章"
    }, {
        "name": "色情服务",
        "value": 304607,
        "path": "非法服务/色情服务"
    }, {
        "name": "赌博",
        "value": 4733,
        "path": "非法服务/赌博"
    }]
}, {
    "name": "广告",
    "value": 382819,
    "path": "广告",
    "children": [{
        "name": "银行广告",
        "value": 188121,
        "path": "广告/银行广告"
    }, {
        "name": "房地产广告",
        "value": 162340,
        "path": "广告/房地产广告"
    }, {
        "name": "教育培训",
        "value": 1622,
        "path": "广告/教育培训"
    }, {
        "name": "汽车广告",
        "value": 5596,
        "path": "广告/汽车广告"
    }, {
        "name": "旅游广告",
        "value": 668,
        "path": "广告/旅游广告"
    }, {
        "name": "贷款广告",
        "value": 1526,
        "path": "广告/贷款广告"
    }, {
        "name": "招聘广告",
        "value": 1042,
        "path": "广告/招聘广告"
    }, {
        "name": "网站推广",
        "value": 1666,
        "path": "广告/网站推广"
    }, {
        "name": "其他广告",
        "value": 20238,
        "path": "广告/其他广告"
    }]
}, {
    "name": "其他",
    "value": 74486,
    "path": "其他"
}];

myChart.hideLoading();

function colorMappingChange(value) {
    var levelOption = getLevelOption(value);
    chart.setOption({
        series: [{
            levels: levelOption
        }]
    });
}

var formatUtil = echarts.format;

function getLevelOption() {
    return [
        {
            itemStyle: {
                normal: {
                    borderWidth: 0,
                    gapWidth: 5
                }
            }
        },
        {
            itemStyle: {
                normal: {
                    gapWidth: 1
                }
            }
        },
        {
            colorSaturation: [0.35, 0.5],
            itemStyle: {
                normal: {
                    gapWidth: 1,
                    borderColorSaturation: 0.6
                }
            }
        }
    ];
}

myChart.setOption(option = {

    title: {
        text: '垃圾短信类型',
        left: 'center'
    },

    tooltip: {
        formatter: function (info) {
            var value = info.value;
            var treePathInfo = info.treePathInfo;
            var treePath = [];

            for (var i = 1; i < treePathInfo.length; i++) {
                treePath.push(treePathInfo[i].name);
            }

            return [
                '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                '数量: ' + formatUtil.addCommas(value),
            ].join('');
        }
    },

    series: [
        {
            name:'垃圾短信类型',
            type:'treemap',
            visibleMin: 300,
            label: {
                show: true,
                formatter: '{b}'
            },
            itemStyle: {
                normal: {
                    borderColor: '#fff'
                }
            },
            levels: getLevelOption(),
            data: data
        }
    ]
});