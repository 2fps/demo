const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function(ws) {
    console.log('connected');
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });

    ws.send('something');
});