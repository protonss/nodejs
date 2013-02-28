var http  = require('http')
  , fs    = require('fs')
  , path  = require('path')
  , mime  = require('mime')
  , cache = {};

function send404(response, path) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
  console.log('404 %s', path);
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    {"content-type": mime.lookup(path.basename(filePath))}
  );
  response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(response, absPath);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      } else {
        send404(response, absPath);
      }
    });
  }
}

var server = http.createServer(function(request, response) {
  var filePath = 'public/index.html';

  if (request.url !== '/') {
    filePath = 'public' + request.url;
  }

  var absPath = './' + filePath;
  serveStatic(response, cache, absPath);
});

server.listen(3000, function() {
  console.log("Server listening on port 3000.");
});

//var chatServer = require('./lib/chat_server');
//chatServer.listen(server);


