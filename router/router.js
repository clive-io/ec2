var proxy = require('redbird')({port: 80, xfwd: false});
var express = require('express');
var app = express();
var http =  require('http').Server(app);

app.get('/', function(req, res){
  var outstring = 'Proxy paths:\n';
  Object.keys(proxy.routing).forEach(function(key){
    for(var i = 0; i < proxy.routing[key].length; i++)
      for(var j = 0; j < proxy.routing[key][i].urls.length; j++)
        outstring += '  ' + key + ' => ' + proxy.routing[key][i].urls[j].href + '\n';
  })
  res.send(outstring);
});

app.get(/^\/register\/([a-zA-Z0-9\.]+)\/([0-9]+)/, function(req, res){
  proxy.register(req.params[0], 'http://localhost:' + req.params[1]);
  res.send('Registered: ' + req.params[0] + ' => ' + 'http://localhost:' + req.params[1]);
});

app.get(/^\/unregister\/([a-zA-Z0-9\.]+)/, function(req, res){
  proxy.unregister(req.params[0]);
  res.send('Unregistered: ' + req.params[0]);
});

http.on('listening', function(){
  console.log('listening on %s:%s', http.address().address, http.address().port);
});
http.listen(10000, '127.0.0.1');
