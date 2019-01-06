const fs = require('fs');
const path = require('path');

var dir = path.basename(__dirname);

exports.getHeat = function (req, res) {
    // Get parameter list
    let dateString = req.params['date'];
    let type = req.params['type'];
    const dateArray = dateString.split('.');
    if(dateArray.length > 1) {
        dateString = dateArray[0]
    }
    const dateList = dateString.split('-');
    dateList.forEach((element, i, arr) => {
        arr[i] = String(element).padStart(2, 0);
    });
    dateString = dateList.reduce((a, b) => `${a}-${b}`);
    let resData = [];
    try {
        resData = fs.readFileSync(path.join(dir, `loc/${type}/${dateString}.json`));
        res.statusCode = 200;
        res.set({
            'Content-Type': 'application/json;charset=UTF-8',
            'Cache-Control': 'public, max-age=31557600'
        });
        res.end(resData);
    } catch (error) {
        res.statusCode = 404;
        res.end();
    }
    
}
