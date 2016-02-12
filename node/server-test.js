var express = require('express');
var app = express();
var http = require('http').Server(app);

var PORT = 80;

http.listen(PORT, function(){
    console.log('listening on *:' + PORT);
});

app.get('/', function(req, res){
    res.sendFile('index.html', { root: __dirname });
});

