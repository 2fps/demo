const io = require('socket.io')();

io.on('connection', function(client) { 
    console.log('connected');
});
io.listen(3000);