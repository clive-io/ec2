var PORT = 10000;
var SAVEFILE = "~/.router/save.json";

SAVEFILE = require('expand-tilde')(SAVEFILE);
var fs = require('fs');
require('mkdirp')(require('path').dirname(SAVEFILE), function(err){
  if(err){
    console.error('Unable to access savefile: mkdirp error');
    process.exit(1);
  }else try{
    fs.closeSync(fs.openSync(SAVEFILE, 'a'));
    fs.accessSync(SAVEFILE, fs.R_OK | fs.W_OK);
  }catch(e){
    console.error('Unable to access savefile: ' + e);
    process.exit(1);
  }
});

var proxy = require('redbird')({
  port: 80,
  xfwd: false,
  ssl: {
    port: 443,
    key: "~/.router/certs/default.key",
    cert: "~/.router/certs/default.crt",
    ca: ["~/.router/certs/default.ca"]
  }
});
var express = require('express');
var app = express();
var http =  require('http').Server(app);
var bodyParser = require('body-parser');
app.use(bodyParser.json());

function exportJSON(){
  var routes = {};
  Object.keys(proxy.routing).forEach(function(route){
    for(var i = 0; i < proxy.routing[route].length; i++)
      for(var j = 0; j < proxy.routing[route][i].urls.length; j++)
        routes[route] = proxy.routing[route][i].urls[j].port;
  });
  return routes;
}

function importJSON(routes){
  for(var route in routes)
    if(routes.hasOwnProperty(route) 
      && /^[a-zA-Z0-9\.]+$/.test(route) //Test it against the same regexes as /register
      && /^[0-9]+$/.test(routes[route]))
      proxy.register(route, 'http://localhost:' + routes[route]);
}

app.get(['/', '/export'], function(req, res){
  res.send(JSON.stringify(exportJSON(), null, 2));
});
app.post('/import', function(req, res){
  //`curl -H "Content-Type: application/json" --data @FILEPATH localhost:10000/import`
  importJSON(req.body);
  save(req,res);
});

function save(req, res){
  var str = JSON.stringify(exportJSON());
  fs.writeFile(SAVEFILE, str, function(err){
    if(err) res.send('error: ' + err);
    else res.send('Saved: ' + str);
  });
}
app.get('/save', save);
function load(cb){
  if(typeof cb !== "function") cb = console.log;
  
  fs.readFile(SAVEFILE, function(err, data){
    if(err){
      cb('error: ' + err);
    }else try{
      var obj = JSON.parse(data);
      importJSON(obj);
      cb('Loaded: ' + JSON.stringify(obj));
    }catch(e){
      cb('JSON parse error');
    }
  });
}
app.get('/load', function(req, res){
  load(res.send);
});
load(); //Initial load

app.get(/^\/register\/([a-zA-Z0-9\.]+)\/([0-9]+)/, function(req, res){
  proxy.unregister(req.params[0]);
  proxy.register(req.params[0], 'http://localhost:' + req.params[1]);
  res.send('Registered: http://' + req.params[0] + ' => ' + 'http://localhost:' + req.params[1] + '\r\n');
  save(req, res);
});
app.post(/^\/register\/([a-zA-Z0-9\.]+)\/([0-9]+)/, function(req, res){
  if(req.body.key !== undefined || req.body.cert !== undefined){
    try{
      fs.accessSync(req.body.key, fs.constants.R_OK);
      fs.accessSync(req.body.cert, fs.constants.R_OK);
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
  save(req, res);
});

app.get(/^\/unregister\/([a-zA-Z0-9\.]+)/, function(req, res){
  proxy.unregister(req.params[0]);
  res.send('Unregistered: ' + req.params[0] + '\r\n');
  save(req, res);
});

http.on('listening', function(){
  console.log('listening on %s:%s', http.address().address, http.address().port);
});
http.listen(PORT, '127.0.0.1');
