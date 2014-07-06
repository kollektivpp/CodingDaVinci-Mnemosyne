console.log(require('socket.io'));
var http = require('http').createServer();
console.log(http);
var io = require('socket.io')(http);
var arduino = require('duino');
var board = new arduino.Board({
    debug: false,
    baudrate: 9600
});
var sockets = [];
var value = null;
var buttonClicked = 0;

io.on('connection', function(socket) {
    'use strict';

    sockets.push(socket);
});

var dataHandler = function(data) {
    'use strict';

    data = parseInt(data);

    buttonClicked = (new Date()).getTime();

    if (value !== data) {
        console.log(data,sockets.length);

        sockets.forEach(function(socket) {
            socket.emit('controlstation', data);
        });

    }

    value = data;

};

board.on('data', dataHandler);
http.listen(8000);
