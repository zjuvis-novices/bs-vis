var myChart = echarts.init(document.getElementById('pieChart'));

var option = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['诈骗','非法服务','广告','其他','中奖诈骗','信用卡诈骗','虚假红包','钓鱼网站','代开发票','办证刻章','色情服务','赌博','银行广告','房地产广告','教育培训','汽车广告','旅游广告','贷款广告','招聘广告','网站推广','其他广告']
    },
    series: [
        {
            name:'垃圾短信类别',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:538381, name:'诈骗'},
                {value:2166629, name:'非法服务', selected:true},
                {value:382819, name:'广告'},
                {value:74486, name:'其他'}
            ]
        },
        {
            name:'垃圾短信类别',
            type:'pie',
            radius: ['40%', '55%'],
            label: {
                normal: {
                    formatter: '{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    // shadowBlur:3,
                    // shadowOffsetX: 2,
                    // shadowOffsetY: 2,
                    // shadowColor: '#999',
                    // padding: [0, 7],
                    rich: {
                        // a: {
                        //     color: '#999',
                        //     lineHeight: 22,
                        //     align: 'center'
                        // },
                        // abg: {
                        //     backgroundColor: '#333',
                        //     width: '100%',
                        //     align: 'right',
                        //     height: 22,
                        //     borderRadius: [4, 4, 0, 0]
                        // },
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            fontSize: 16,
                            lineHeight: 33
                        },
                        per: {
                            color: '#eee',
                            backgroundColor: '#334455',
                            padding: [2, 4],
                            borderRadius: 2
                        }
                    }
                }
            },
            data:[
                {value:1589, name:'中奖诈骗'},
                {value:17527, name:'信用卡诈骗'},
                {value:917, name:'虚假红包'},
                {value:518339, name:'钓鱼网站'},
                {value:1831662, name:'代开发票'},
                {value:25627, name:'办证刻章'},
                {value:304607, name:'色情服务'},
                {value:4733, name:'赌博'},
                {value:188121 , name:'银行广告'},
                {value:162340 , name:'房地产广告'},
                {value:1622 , name:'教育培训'},
                {value:5596 , name:'汽车广告'},
                {value:668 , name:'旅游广告'},
                {value:1526 , name:'贷款广告'},
                {value:1042 , name:'招聘广告'},
                {value:1066 , name:'网站推广'},
                {value:20238 , name:'其他广告'},
                {value:74486 , name:'其他'}
            ]
        }
    ]
};

myChart.setOption(option);
