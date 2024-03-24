const http = require('http'),
  fs = require('fs'),
  url = require('url');

http.createServer((request, response) => {
  let addr = request.url,
    q = new URL(addr, 'http://' + request.headers.host),
    filePath = '';

    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Added to log.');
      }
    });

    if (q.pathname.includes('documentation')) {
      filePath = (__dirname + '/documentation.html');
    } else {
      filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(data);
      response.end();
    });
}).listen(8080);
console.log('My first Node test server is running on Port 8080.');





// For all requests coming in to your “server.js” file, use the fs module to log both the request
// URL and a timestamp to the “log.txt” file. For another demonstration of what this should look
// like, refer to this GIF of checking the log file after navigating to each page.
