const http  = require('http');
const url   = require('url');

function start(hostname, port) {
    http
    .createServer((request, response) => {
        var pathname = url.parse(request.url).pathname;
        console.log(request);
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Hello World");
        response.end();
    })
    .listen(port, hostname, () => {
        console.log(`running at http://${hostname}:${port}/`);
    });
}

exports.start = start;