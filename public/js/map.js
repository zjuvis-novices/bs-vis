// Initialize AMap Loca
var map = new Loca.create('container', {
    resizeEnable: true,
    zoom: 10,
    center:[120.2,30.25],
    mapStyle: 'amap://styles/grey'
});

// var heatmap;
// map.plugin(["AMap.Heatmap"], function() {
//     //初始化heatmap对象
//     heatmap = new AMap.Heatmap(map, {
//         radius: 25, //给定半径
//         opacity: [0, 0.8]
//     });
// });

// function changedisplay() {
//     if($("#displaytype").val() == 1)
//     {
//         heatmap.hide()
//        // myChart.show()
//     }
//     else if($("#displaytype").val() == 2)
//     {
//         heatmap.show()
//        // myChart.hide()
//     }
// }

// function mapdisplay() {
//     if(!$("#traffic").is(':checked')&&!$("#emotion").is(':checked')){
//         heatmap.hide()
//     }
// }
