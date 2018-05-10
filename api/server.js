const environment_config = require("./config/environments/config");
const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const postsStream = require('./app/controllers/postsStream');

// make sure the minimum version of node is being used, 8.8.1
const [major, minor] = process.versions.node.split(".").map(parseFloat);
if (major < 8 || (major === 8 && minor < 8)) {
  console.log("⚠️ Please make sure you are running Node at >= 8.8.1 ⚠️");
  process.exit();
}

// start the application server
const app = require("./app");
app.set("port", environment_config.port || 7777);

const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', postsStream.index)

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/postsstream') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(app.get("port"), () => {
  console.log(`🏃 Express running → PORT ${server.address().port}`);
});
