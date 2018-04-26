const url = require('url');
var dataModel = require('./data_model');

function handleTraffic(req, res) {
    // Get parameter list
    var params          = url.parse(req.url, true).query;
    var responseExpr    = null;
    var type            = params['type'];
    var weekday         = params['weekday'];
    if(weekday) weekday = weekday.toUpperCase();
    var hour            = parseInt(params['hour']);
    if(type === 'speed') {
        responseExpr = dataModel.trafficData.getSpeed(weekday, hour);
    } else if(type === 'density') {
        responseExpr = dataModel.trafficData.getDensity(weekday, hour);
    }
    res.statusCode = 200;
    res.set({
        'Content-Type': 'application/json;charset=UTF-8',
        'Cache-Control': 'public, max-age=31557600'
    });
    res.end(JSON.stringify(responseExpr));
}

function handlePOI(req, res) {
    res.statusCode = 200;
    res.set({
        'Content-Type': 'application/json;charset=UTF-8',
        'Cache-Control': 'public, max-age=31557600'
    });
    res.end(JSON.stringify(dataModel.poiData));
}

exports.handleTraffic   = handleTraffic;
exports.handlePOI       = handlePOI;