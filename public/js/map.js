// Initialize AMap Loca
var map = Loca.create('container', {
    resizeEnable: true,
    zoom: 10,
    center:[120.2,30.25],
    mapStyle: 'amap://styles/grey'
});

var heatLayer = Loca.visualLayer({
    container: map,
    type: 'heatmap',
    shape: 'normal'
});

var positiveLayer = Loca.visualLayer({
    fitView: true,
    container: map,
    type: 'point',
    shape: 'circle'
});

var negativeLayer = Loca.visualLayer({
    fitView: true,
    container: map,
    type: 'point',
    shape: 'circle'
});

var tirednessLayer = Loca.visualLayer({
    fitView: true,
    container: map,
    type: 'point',
    shape: 'circle'
});

var trafficLayer = Loca.visualLayer({
    fitView: true,
    container: map,
    type: 'point',
    shape: 'circle'
});

positiveLayer.updateData = function () {
    positiveLayer.setData(currentVisualData, {
        lnglat  : 'lnglat',
        value   : 'positive' + currentHour
    });
};

negativeLayer.updateData = function () {
    negativeLayer.setData(currentVisualData, {
        lnglat  : 'lnglat',
        value   : 'negative' + currentHour
    });
};

tirednessLayer.updateData = function() {
    tirednessLayer.setData(currentVisualData, {
        lnglat  : 'lnglat',
        value   : 'tiredness' + currentHour
    });
};

trafficLayer.updateData = function() {
    trafficLayer.setData(currentVisualData, {
        lnglat  : 'lnglat',
        value   : 'traffic' + currentHour
    })
};

var currentHeat = 'positive';
heatLayer.updateData = function() {
    heatLayer.setData(currentVisualData, {
        lnglat  : 'lnglat',
        value   : currentHeat + currentHour
    })
};

function updateVisualDataBinding() {
    if(currentDisplay.visualStyle === 'bubble') {
        if(currentDisplay.overlayType['emotion']) {
            if(currentDisplay.emotionType['positive']) {
                positiveLayer.updateData();
            } else if(currentDisplay.emotionType['negative']) {
                negativeLayer.updateData();
            } else if(currentDisplay.emotionType['tiredness']) {
                tirednessLayer.updateData();
            }
        }
        if(currentDisplay.overlayType['traffic']) {
            trafficLayer.updateData();
        }
    } else {
        if(currentDisplay.overlayType['emotion']) {
            if(currentDisplay.overlayType['positive']) {
                currentHeat = 'positive';
            } else if(currentDisplay.overlayType['negative']) {
                currentHeat = 'negative';
            } else {
                currentHeat = 'tiredness';
            }
            heatLayer.updateData();
        } else if(currentDisplay.overlayType['traffic']) {
            currentHeat = 'traffic';
            heatLayer.updateData();
        }
    }
}

function updateVisualRendering() {
    
}

positiveLayer.setOptions({
    style: {
        radius: function (data) { return data.value['positive' + currentHour] * 15; },
        fill: '#08519c',
        opacity: function (data) { return data.value['positive' + currentHour]; },
        lineWidth: 0.2,
        stroke: '#50abff'
    }
});

negativeLayer.setOptions({
    style: {
        radius: function (data) { return data.value['negative' + currentHour] * 15; },
        fill: '#08519c',
        opacity: function (data) { return data.value['negative' + currentHour]; },
        lineWidth: 0.2,
        stroke: '#50abff'
    }
});

tirednessLayer.setOptions({
    style: {
        radius: function (data) { return data.value['tiredness' + currentHour] * 15; },
        fill: '#08519c',
        opacity: function (data) { return data.value['tiredness' + currentHour]; },
        lineWidth: 1,
        stroke: '#50abff'
    }
});

trafficLayer.setOptions({
    style: {
        radius: function (data) { return data.value['traffic' + currentHour]; },
        fill: '#08519c',
        opacity: 1,
        lineWidth: 1,
        stroke: '#50abff'
    }
});

heatLayer.setOptions({
    style: {
        radius: 25,
        opacity: [0, 0.7],
    },
    gradient: {
        0.5: 'blue',
        0.65: 'rgb(117,211,248)',
        0.7: 'rgb(0, 255, 0)',
        0.9: '#ffea00',
        1.0: 'red'
    }
});

// heatLayer.setData(districts, {lnglat:'center'});

poiData.then(updateVisualData).then(function() {
    negativeLayer.updateData();
    negativeLayer.render();
});

// updateDisplayLayers()



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
