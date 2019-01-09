var wordcloud;
var wordcloudOptions = {
    series: [{
        type: 'wordCloud',
        shape: 'square',
        sizeRange: [12, 60],
        rotationRange: [-4, 4],
        rotationStep: 0.2,
        gridSize: 8,
        width: '100%',
        height: '100%',
        textStyle: {
            normal: {
                fontFamily: "Roboto, Raleway, 'Segoe UI', -apple-system, BlinkMacSystemFont, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'Hiragino Sans GB', 'Noto Sans CJK SC', '思源黑体', 'Source Han Sans SC', '等线', '方正等线', 'Dengxian', 'Microsoft YaHei', 'Wenquanyi Micro Hei', 'WenQuanYi Micro Hei Mono', 'WenQuanYi Zen Hei', 'WenQuanYi Zen Hei', 'Apple LiGothic Medium', 'SimHei', 'ST Heiti', 'WenQuanYi Zen Hei Sharp', sans-serif",
                color: function () {
                    // Random color
                    return 'rgb(' + [
                        Math.round(Math.random() * 180 + 40),
                        Math.round(Math.random() * 180 + 40),
                        Math.round(Math.random() * 180 + 40)
                    ].join(',') + ')';
                }
            }
        },
        data: []
    }]
};

function updateWordcloudData() {
    var i = getCurrentIndex();
    var data = wordFreqs[i].map(function (val) { return { name: val[0], value: val[1] } } );
    wordcloud.setOption({ series: [{ data }] });
}

wordFreqPromise = wordFreqPromise.then(updateWordcloudData);
document.addEventListener('timechanged', updateWordcloudData);
document.addEventListener('datechanged', updateWordcloudData);

$('#wordcloud-container').promise().then(function() {
    wordcloud = echarts.init(document.getElementById('wordcloud-container'));
    wordcloud.setOption(wordcloudOptions);
});
