// Initialize AMap Loca
var map = Loca.create('container', {
    resizeEnable: true,
    zoom: 10,
    center:[120.2,30.25],
    mapStyle: 'amap://styles/grey'
});

// Heat layer initialization
var heatLayer = Loca.visualLayer({
    container: map,
    type: 'heatmap',
    shape: 'normal'
});
heatLayer.hide = hideLayer;    heatLayer.show = showLayer;
// Bubble layer initialization
var positiveLayer = Loca.visualLayer(new BubbleLayerOptions());
positiveLayer.hide = hideLayer;     positiveLayer.show = showLayer;
positiveLayer.updateData = updateLayerData('positive');
var negativeLayer = Loca.visualLayer(new BubbleLayerOptions());
negativeLayer.hide = hideLayer;     negativeLayer.show = showLayer;
negativeLayer.updateData = updateLayerData('negative');
var tirednessLayer = Loca.visualLayer(new BubbleLayerOptions());
tirednessLayer.hide = hideLayer;    tirednessLayer.show = showLayer;
tirednessLayer.updateData = updateLayerData('tiredness');
var trafficLayer = Loca.visualLayer(new BubbleLayerOptions());
trafficLayer.hide   = hideLayer;    trafficLayer.show   = showLayer;
trafficLayer.updateData = updateLayerData('traffic');

var currentHeat = 'positive';
heatLayer.updateData = function() {
    heatLayer.setData(currentVisualData, {
        lnglat  : 'lnglat',
        value   : currentHeat + currentHour
    })
    return this;
};

var infoWin;
positiveLayer.on('click', function (ev) {
    if (!infoWin) {
        infoWin = new AMap.InfoWindow();
    }
    var type = ev.type;
    var rawData = ev.rawData;
    var originalEvent = ev.originalEvent;
    var lnglat = ev.lnglat;
    infoWin.setContent('<span class="tag-title">' + rawData.name + '</span><br/>' + "正向：" + rawData["positive" + currentHour].toFixed(2));
    infoWin.open(map.getMap(), new AMap.LngLat(lnglat[0], lnglat[1]));

});

negativeLayer.on('click', function (ev) {
    if (!infoWin) {
        infoWin = new AMap.InfoWindow();
    }
    var type = ev.type;
    var rawData = ev.rawData;
    var originalEvent = ev.originalEvent;
    var lnglat = ev.lnglat;
    infoWin.setContent('<span class="tag-title">' + rawData.name + '</span><br/>' + "负向：" +rawData["negative" + currentHour].toFixed(2));
    infoWin.open(map.getMap(), new AMap.LngLat(lnglat[0], lnglat[1]));

});

tirednessLayer.on('click', function (ev) {
    if (!infoWin) {
        infoWin = new AMap.InfoWindow();
    }
    var type = ev.type;
    var rawData = ev.rawData;
    var originalEvent = ev.originalEvent;
    var lnglat = ev.lnglat;
    infoWin.setContent('<span class="tag-title">' + rawData.name + '</span><br/>' + "疲惫：" +rawData["tiredness"+currentHour].toFixed(2));
    infoWin.open(map.getMap(), new AMap.LngLat(lnglat[0], lnglat[1]));

});
// Update data binding of layers
function updateVisualDataBinding() {
    if(currentDisplay['heat']) {
        if(currentDisplay['emotion']) {
            if(currentDisplay['positive']) {
                positiveLayer.updateData();
            } else if(currentDisplay['negative']) {
                negativeLayer.updateData();
            } else if(currentDisplay['tiredness']) {
                tirednessLayer.updateData();
            }
        }
        if(currentDisplay['traffic']) {
            trafficLayer.updateData();
        }
    } else {
        if(currentDisplay['emotion']) {
            if(currentDisplay['positive']) {
                currentHeat = 'positive';
            } else if(currentDisplay['negative']) {
                currentHeat = 'negative';
            } else {
                currentHeat = 'tiredness';
            }
            heatLayer.updateData();
        } else if(currentDisplay['traffic']) {
            currentHeat = 'traffic';
            heatLayer.updateData();
        }
    }
}

// This code fragment is to:
// When getting POI data is done asyncly,
// update current visual data asyncly.
// When updating current visual data is done,
// update the data binding to the layers
// and update the layers' visibility syncly.
poiData.done(function () {
    updateDisplayStatus();
    updateVisualData().done(function() {
        positiveLayer.updateData();
        negativeLayer.updateData();
        tirednessLayer.updateData();
        trafficLayer.updateData();
        heatLayer.updateData();
    }).done(updateLayerVisibility);
});

function updateLayerVisibility() {
    if(currentDisplay['bubble']) {
        heatLayer.hide();
        if(currentDisplay['emotion']) {
            if(currentDisplay['positive'])  positiveLayer.show();
            else                            positiveLayer.hide();
            if(currentDisplay['negative'])  negativeLayer.show();
            else                            negativeLayer.hide();
            if(currentDisplay['tiredness']) tirednessLayer.show();
            else                            tirednessLayer.hide();
        } else {
            positiveLayer.hide(); negativeLayer.hide(); tirednessLayer.hide();
        }
        if(currentDisplay['traffic'])   trafficLayer.show();
        else                            trafficLayer.hide();
    } else {
        positiveLayer.hide();   negativeLayer.hide();
        tirednessLayer.hide();  trafficLayer.hide();
        if(currentDisplay['traffic']) {
            currentHeat = 'traffic';
            heatLayer.updateData();
            if(!heatLayer.shown) heatLayer.show();
            else heatLayer.render()
        } else if(currentDisplay['emotion']) {
            if(currentDisplay['positive'])  currentHeat = 'positive';
            if(currentDisplay['negative'])  currentHeat = 'negative';
            if(currentDisplay['tiredness']) currentHeat = 'tiredness';
            heatLayer.updateData();
            if(!heatLayer.shown) heatLayer.show();
            else heatLayer.render();
        } else {
            if(heatLayer.shown) heatLayer.hide();
        }
    }
}

function updateDataByTime() {
    setTimeout(function () {
        if(positiveLayer.shown)     positiveLayer.updateData().render();
        if(negativeLayer.shown)     negativeLayer.updateData().render();
        if(tirednessLayer.shown)    tirednessLayer.updateData().render();
        if(trafficLayer.shown)      trafficLayer.updateData().render();
        if(heatLayer.shown)         heatLayer.updateData().render();
    });
}

// Update binding to event
onToggleEmotionCallbacks.updateLayerVisibility  = [];
onToggleDispalyCallbacks.updateLayerVisibility  = [];
onChangeVisualCallbacks.updateLayerVisibility   = [];
onTimeChangeCallbacks.updateDataByTime          = [];
onDateSelectionCallbacks.updateDataByTime       = [];

// --------------------------------
// These are the visual style options of layers
positiveLayer.setOptions({
    style: {
        radius: function (data) { return (Math.pow(data.value['positive' + currentHour], 1.2) + 0.2) * 60; },
        fill: positiveColor,
        opacity: function (data) {return Math.pow(data.value['positive' + currentHour], 3); },
        lineWidth: 0.2,
        stroke: "#FFFFFF"
    }
});

negativeLayer.setOptions({
    style: {
        radius: function (data) { return (Math.pow(data.value['negative' + currentHour], 1.2) + 0.2) * 60; },
        fill: negativeColor,
        opacity: function (data) { return Math.pow(data.value['negative' + currentHour], 3); },
        lineWidth: 0.2,
        stroke: "#FFFFFF"
    }
});

tirednessLayer.setOptions({
    style: {
        radius: function (data) { return (Math.pow(data.value['tiredness' + currentHour], 0.2) + 0.2) * 20; },
        fill: tirednessColor,
        opacity: function (data) { return Math.pow(data.value['tiredness' + currentHour], 1.8); },
        lineWidth: 1,
        stroke: "#FFFFFF"
    }
});

trafficLayer.setOptions({
    style: {
        radius: function (data) { return Math.pow(data.value['traffic' + currentHour], 5) * 200; },
        fill: trafficColor,
        opacity: function (data) { return Math.pow(data.value['traffic' + currentHour], 5); },
        lineWidth: 1,
        stroke: '#FFFFFF'
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

// --------------------------------
// These functions are used to extend the functionality
// of a Loca layer object.
// Note that the 'this' pointer is dynamically binded
function BubbleLayerOptions() {
    this.container  = map;
    this.type       = 'point';
    this.shape      = 'circle';
    this.eventSupport =  true;
}

function hideLayer() {
    if(this._dataSet) {
        if(this.shown) {
            if(this.shown !== undefined) {
                map.removeLayer(this);
            }
            this.shown = false;
        }
    }
    return this;
}

function showLayer() {
    if(this._dataSet) {
        if(!this.shown) {
            this.shown = true;
            map.addLayer(this);
            this.render();
        }
    }
    return this;
}

function updateLayerData(typeStr) {
    return function() {
        this.setData(currentVisualData, {
            lnglat  : 'lnglat',
            value   : typeStr + currentHour
        });
        return this;
    };
}
