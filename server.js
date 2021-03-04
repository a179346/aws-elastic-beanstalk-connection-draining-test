require('./system/initEnv.js');
require('./utils/plog');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Timer } = require('nodejs-timer');
const { eRESPONSE } = require('./lib/enum.js');
const gs = require('./system/gracefulShutDown');

// server ready delay (ms)
const readyDelay = 60000;
// send ok delay (ms)
const okDelay = 10000;

console.plog('server', 'Loading ...');
console.plog('server', 'readyDelay:' + readyDelay, 'okDelay:' + okDelay);
let serverReady = false;
setTimeout(() => {
  serverReady = true;
}, readyDelay);
const app = express();
const server = http.createServer(app);

server.connectionCount = 0;
server.totalConnections = 0;
for (const key in eRESPONSE) {
  const content = eRESPONSE[key];
  server[content] = 0;
}

app.enable('trust proxy');
app.use(cors());

app.get('/', okHandler);
app.get('/ok', okHandler);
function okHandler (req, res) {
  res.send('ok');
}

app.get('/test', testHandler);
function testHandler (req, res) {
  server.connectionCount += 1;
  server.totalConnections += 1;
  // console.plog('request', 'connections:' + server.connectionCount);

  if (!serverReady && gs.forceShutDown)
    return response(res, eRESPONSE.SHUTTING_DOWN_AND_NOT_READY);
  if (!serverReady)
    return response(res, eRESPONSE.NOT_READY);
  if (gs.forceShutDown)
    return response(res, eRESPONSE.SHUTTING_DOWN);

  setTimeout(() => {
    response(res, eRESPONSE.OK);
  }, okDelay);
}

function response (res, content) {
  server.connectionCount -= 1;
  server[content] += 1;

  // console.plog('response', content, 'connections:' + server.connectionCount);
  res.send(content);
}

// unhandled routes
app.use(function (req, res) {
  if (res.headersSent) return;
  res.send('notFound');
});

server.on('error', function (err) {
  console.plog('server', 'error', err);
});

server.on('listening', function () {
  console.plog('server', 'listening', server.address());
});

server.on('close', function () {
  console.plog('server', 'close');
});

const readyCheckTimer = new Timer(() => {
  if (!serverReady) {
    readyCheckTimer.start(1000);
    return;
  }
  server.listen(process.env.PORT);
});
readyCheckTimer.start(1000);

module.exports = server;