var dataModel = require('./data_model');
var server = require('./server');

const hostname = 'localhost';
const port = 8080;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
//   res.end(JSON.stringify(dataModel.trafficData.getSpeed("SUNDAY", 0)));
//   // res.end(JSON.stringify(poiData));
// });

// server.listen(port, hostname, () => {
//   console.log(`running at http://${hostname}:${port}/`);
// });

server.start(hostname, port);