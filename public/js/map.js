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
        radius: 15,
        opacity: [0, 0.8]
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
var adLayer = Loca.visualLayer(new BubbleLayerOptions());
adLayer.hide = hideLayer;     adLayer.show = showLayer;
adLayer.updateData = updateLayerData('ad');
adLayer.setData([], { lnglat: 'lnglat', value: 'value' });
var illegalLayer = Loca.visualLayer(new BubbleLayerOptions());
illegalLayer.hide = hideLayer;     illegalLayer.show = showLayer;
illegalLayer.updateData = updateLayerData('illegal');
illegalLayer.setData([], { lnglat: 'lnglat', value: 'value' });
var scamLayer = Loca.visualLayer(new BubbleLayerOptions());
scamLayer.hide = hideLayer;    scamLayer.show = showLayer;
scamLayer.updateData = updateLayerData('scam');
scamLayer.setData([], { lnglat: 'lnglat', value: 'value' });

// Update data binding of layers
function updateVisualDataBinding() {
    if(currentDisplay['heat']) {
        heatLayer.updateData();
    } else {
        if(currentDisplay['ad']) {
            adLayer.updateData();
        } else if(currentDisplay['illegal']) {
            illegalLayer.updateData();
        } else if(currentDisplay['scam']) {
            scamLayer.updateData();
        }
    }
}

function updateLayerVisibility() {
    if(currentDisplay['bubble']) {
        heatLayer.hide();
        if(currentDisplay['ad']) adLayer.show();
        else adLayer.hide();
        if(currentDisplay['illegal']) illegalLayer.show();
        else illegalLayer.hide();
        if(currentDisplay['scam']) scamLayer.show();
        else scamLayer.hide();
    } else {
        heatLayer.show();
        adLayer.hide();
        illegalLayer.hide();
        scamLayer.hide();
    }
}

function updateDataByTime() {
    if(adLayer.shown)       { adLayer.updateData().render();        }
    if(illegalLayer.shown)  { illegalLayer.updateData().render();   }
    if(scamLayer.shown)     { scamLayer.updateData().render();      }
    if(heatLayer.shown)     { heatLayer.updateData().render();      }
}

// Update binding to event
onToggleDispalyCallbacks.updateLayerVisibility  = [];

// --------------------------------
// These are the visual style options of layers
adLayer.setOptions({
    style: {
        radius: 2,
        fill: adColor,
        opacity: 0.3,
        lineWidth: 0
    }
});

illegalLayer.setOptions({
    style: {
        radius: 2,
        fill: illegalColor,
        opacity: 0.3,
        lineWidth: 0
    }
});

scamLayer.setOptions({
    style: {
        radius: 2,
        fill: scamColor,
        opacity: 0.3,
        lineWidth: 0
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
    this.eventSupport = false;
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
            value   : 'value'
        });
        return this;
    };
}
