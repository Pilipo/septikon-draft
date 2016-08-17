var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// serve up images and such
app.use(express.static('assets'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.htm');
});

io.on('connection', function(socket) {
    console.log('user connected');
});

http.listen(3000, function() {
    console.log('Server running at localhost:3000');
});
