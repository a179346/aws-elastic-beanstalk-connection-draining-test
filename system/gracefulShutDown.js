const { eRESPONSE } = require('../lib/enum.js');
function GS () {
  this.forceShutDown = false;  // true:"server is shutting down"
  process.on('SIGTERM', () => {
    this.shutDown('SIGTERM');
  });

  process.on('SIGINT', () => {
    this.shutDown('SIGINT');
  });
}

GS.prototype.shutDown = function (type) {
  console.plog('graceful shutdown', 'server 收到關機訊號 ' + type);
  this.forceShutDown = true;

  const server = require('../server');

  console.plog('graceful shutdown', 'Closing server...');
  console.plog('Report 1', 'unhandled connections', server.connectionCount);
  console.plog('Report 1', 'totalConnections', server.totalConnections);
  for (const key in eRESPONSE) {
    const content = eRESPONSE[key];
    console.plog('Report 1', content, server[content]);
  }

  server.close(() => {
    console.plog('graceful shutdown', 'server closed...');
    console.plog('Report 2', 'unhandled connections', server.connectionCount);
    console.plog('Report 2', 'totalConnections', server.totalConnections);
    for (const key in eRESPONSE) {
      const content = eRESPONSE[key];
      console.plog('Report 2', content, server[content]);
    }
    console.plog('graceful shutdown', '十秒後完美關機 ...');
    setTimeout(() => {
      console.plog('graceful shutdown', '完美關機');
      process.exit(0);
    }, 10000);
  });
};

module.exports = new GS();