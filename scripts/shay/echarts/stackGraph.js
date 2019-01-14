var myChart = echarts.init(document.getElementById('stackGraph'));

option = {
    title: {
        text: '短信数量随时间变化'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data:['诈骗','非法服务','广告','其他']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'诈骗',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[915, 650, 511, 474, 745, 1266, 3437, 6665, 14221, 28618, 57279, 60428, 53152, 48466, 50521, 51294, 46646, 45531, 40022, 20250, 4635, 1969, 666, 20]
        },
        {
            name:'非法服务',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[29649, 13990, 6285, 5646, 7351, 17035, 63946, 135088, 180435, 169029, 144278, 116740, 99974, 90833, 90404, 96198, 130714, 175780, 196900, 172325, 110304, 60539, 36510, 16676]
        },
        {
            name:'广告',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[1163, 861, 809, 620, 725, 1124, 3539, 7296, 16074, 37454, 47368, 44152, 41526, 39187, 33795, 33495, 26439, 21217, 14693, 5990, 2815, 1315, 752, 410]
        },
        {
            name:'其他',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[1306, 501, 115, 126, 194, 277, 1166, 2688, 3817, 4839, 4712, 4078, 3969, 3070, 3660, 4320, 4957, 6115, 6349, 7734, 5005, 2879, 1738, 871]
        }
    ]
};

myChart.setOption(option);
