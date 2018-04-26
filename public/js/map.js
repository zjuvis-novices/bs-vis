// Initialize AMap Loca
var loca = new Loca('container', {
    resizeEnable: true,
    zoom: 10,
    center:[120.2,30.25],
    mapStyle: 'amap://styles/grey'
});

// Get the visualization layer
var visualLayer = new Loca.VisualLayer({
    container: loca,
    type: 'point',
    shape: 'circle'
});
