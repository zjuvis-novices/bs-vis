// Initialize AMap Loca
var map = Loca.create('container', {
    resizeEnable: true,
    zoom: 10,
    center:[116.4,39.95],
    mapStyle: 'amap://styles/grey'
});

// Heat layer initialization
var heatLayer = Loca.visualLayer({
    container: map,
    type: 'heatmap',
    shape: 'normal'
});

heatLayer.setOptions({
    style: {
        radius: 20,
        opacity: [0, 1]
    },
    gradient: {
        0.5: '#2c7bb6',
        0.65: '#abd9e9',
        0.7: '#ffffbf',
        0.9: '#fde468',
        1.0: '#d7191c'
    }
});

heatLayer.updateData = function() {
    const c = currentVisualData;
    var data = c.ad.concat(c.illegal).concat(c.scam).concat(c.others);
    heatLayer.setData(data, {
        lnglat  : 'lnglat',
        value   : 'value'
    });
    return this;
};

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

// Update data binding of layers
function updateVisualDataBinding() {
    if(currentDisplay['heat']) {
        heatLayer.updateData();
    } else {
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
    }
}

// updateDisplayStatus();
// getDailyData().done(function() {
//     updateVisualData();
//     positiveLayer.updateData();
//     negativeLayer.updateData();
//     tirednessLayer.updateData();
//     trafficLayer.updateData();
//     heatLayer.updateData();
// }).done(updateLayerVisibility);

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
    } else {
        heatLayer.show();
    }
}

function updateDataByTime() {
    if(positiveLayer.shown)     { positiveLayer.updateData().render();  }
    if(negativeLayer.shown)     { negativeLayer.updateData().render();  }
    if(tirednessLayer.shown)    { tirednessLayer.updateData().render(); }
    if(trafficLayer.shown)      { trafficLayer.updateData().render();   }
    if(heatLayer.shown)         { heatLayer.updateData().render();      }
}

// Update binding to event
onToggleEmotionCallbacks.updateLayerVisibility  = [];
onToggleDispalyCallbacks.updateLayerVisibility  = [];

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
    if(this.shown) {
        if(this.shown) {
            map.removeLayer(this);
        }
        this.shown = false;
    }
    return this;
}

function showLayer() {
    if(!this.shown) {
        this.shown = true;
        map.addLayer(this);
        this.render();
    }
    return this;
}

function updateLayerData(typeStr) {
    return function() {
        this.setData(currentVisualData[typeStr], {
            lnglat  : 'lnglat',
            value   : typeStr + currentHour
        });
        return this;
    };
}
