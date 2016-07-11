var fs = require('fs');
var proxy = require('redbird')({
  port: 80,
  xfwd: false,
  ssl: {
    port: 443,
    key: "certs/default.key",
    cert: "certs/default.crt",
    ca: ["certs/default.ca"]
  }
});
var express = require('express');
var app = express();
var http =  require('http').Server(app);
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
  var outstring = '{\r\n';
  Object.keys(proxy.routing).forEach(function(key){
    for(var i = 0; i < proxy.routing[key].length; i++)
      for(var j = 0; j < proxy.routing[key][i].urls.length; j++)
        outstring += '  \"' + key + '\": ' + proxy.routing[key][i].urls[j].port + ',\r\n';
  });
  res.send(outstring.slice(0,-3) + '\r\n}\r\n');
});

app.get(/^\/register\/([a-zA-Z0-9\.]+)\/([0-9]+)/, function(req, res){
  proxy.unregister(req.params[0]);
  proxy.register(req.params[0], 'http://localhost:' + req.params[1]);
  res.send('Registered: http://' + req.params[0] + ' => ' + 'http://localhost:' + req.params[1] + '\r\n');
});
app.post(/^\/register\/([a-zA-Z0-9\.]+)\/([0-9]+)/, function(req, res){
  if(req.body.key !== undefined || req.body.cert !== undefined){
    try{
      fs.accessSync(req.body.key);
      fs.accessSync(req.body.cert);
    }catch(e){
      res.send('Failure: provided SSL key or cert not accessible\r\n');
      return;
    }
  }
  proxy.register(req.params[0], 'http://localhost:' + req.params[1], {
    ssl: {
      key: req.body.key, //if they're both undefined (as above), then this makes no difference.
      cert: req.body.cert,
      ca: req.body.ca
    }
  });
  res.send('Registered: https://' + req.params[0] + ' => ' + 'http://localhost:' + req.params[1] + '\r\n');
});

app.get(/^\/unregister\/([a-zA-Z0-9\.]+)/, function(req, res){
  proxy.unregister(req.params[0]);
  res.send('Unregistered: ' + req.params[0] + '\r\n');
});

app.post(['/', '/import'], function(req, res){
  //Now use `curl --data-urlencode import@FILENAME localhost:10000`
  var routes;
  try{
    routes = JSON.parse(req.body.import);
  }catch(e){
    res.send('JSON parse error.');
    return;
  }
  for(var route in routes)
    if(routes.hasOwnProperty(route) 
      && /^[a-zA-Z0-9\.]+$/.test(route) //Test it against the same regexes as /register
      && /^[0-9]+$/.test(routes[route]))
      proxy.register(route, 'http://localhost:' + routes[route]);
  res.end();
});

http.on('listening', function(){
  console.log('listening on %s:%s', http.address().address, http.address().port);
});
http.listen(10000, '127.0.0.1');
