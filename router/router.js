var PORT = 10000;
var SAVEFILE = "~/.router/save.json";

var expandTilde = require('expand-tilde');
var fs = require('fs');

var sslDefault = {
  port: 443,
  key: expandTilde("~/.router/certs/default.key"),
  cert: expandTilde("~/.router/certs/default.crt"),
  ca: [expandTilde("~/.router/certs/default.ca")]
};
if(!checkSSL(sslDefault)){
  console.error("inaccessible default SSL config");
  process.exit(1);
}
var proxy = require('redbird')({
  port: 80,
  xfwd: false,
  ssl: sslDefault,
  bunyan: false
});
var express = require('express');
var app = express();
var http =  require('http').Server(app);
var bodyParser = require('body-parser');
app.use(bodyParser.json());


function checkSSL(obj, cb){
  if(!cb) cb = console.error;
  if(typeof obj.key !== "string" || typeof obj.cert !== "string"){
    cb("key and cert paths must be valid strings!");
    return false;
  }
  else try{
    fs.accessSync(obj.key, fs.R_OK);
    fs.accessSync(obj.cert, fs.R_OK);
    if(typeof obj.ca === "undefined")
      cb("WARNING: Certificate has no CAs associated with it.");
    else{
      if(typeof obj.ca === "string")
        obj.ca = [obj.ca];
      if(typeof obj.ca !== "object"){
        cb("CA variable type is wrong");
        return false;
      }
      for(var i = 0; i < obj.ca.length; i++)
        fs.accessSync(obj.ca[i], fs.R_OK);
    }
  }catch(e){
    cb(e);
    return false;
  }
  return true;
}

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

//save() will log stuff.
//save(cb) will callback on success or failure.
//save(error, success) will callback error on failure, success on success.
function save(error, success){
       if(typeof error !== "function" && typeof success !== "function"){ error = console.error; success = console.log; }
  else if(typeof error === "function" && typeof success !== "function"){ success = error; }
  
  var str = JSON.stringify(exportJSON());
  fs.writeFile(SAVEFILE, str, function(err){
    if(err) error('save: writefile error: ' + err);
    else success('Saved: ' + str);
  });
}
function load(cb){
  if(typeof cb !== "function") cb = console.error;
  
  fs.readFile(SAVEFILE, function(err, data){
    if(err){
      cb('load: readfile error: ' + err);
      return;
    }else try{
      var obj = JSON.parse(data);
      importJSON(obj);
    }catch(e){
      cb('load: JSON parse error');
      return;
    }
    cb('Loaded: ' + JSON.stringify(obj));
  });
}

app.get(['/', '/export'], function(req, res){
  res.send(JSON.stringify(exportJSON(), null, 2));
});
app.post('/import', function(req, res){
  //`curl -H "Content-Type: application/json" --data @FILEPATH localhost:10000/import`
  importJSON(req.body);
  save(function(r){res.write(r);}, function(){
    res.send('Imported.');
  });
});

app.get('/save', function(req, res){
  save(res.send);
});
app.get('/load', function(req, res){
  save(res.send);
});

app.get(/^\/register\/([a-zA-Z0-9\.]+)\/([0-9]+)/, function(req, res){
  proxy.unregister(req.params[0]);
  proxy.register(req.params[0], 'http://localhost:' + req.params[1]);
  save(function(r){res.write(r);}, function(){
    res.send('Registered: http://' + req.params[0] + ' => ' + 'http://localhost:' + req.params[1] + '\r\n');
  });
});
app.post(/^\/register\/([a-zA-Z0-9\.]+)\/([0-9]+)/, function(req, res){
  if(typeof req.body !== "object" || Object.keys(req.body).length == 0){
    proxy.unregister(req.params[0]);
    proxy.register(req.params[0], 'http://localhost:' + req.params[1], { ssl: true });
  }else if(!checkSSL(req.body)){
    res.send('Failure: provided SSL key or cert not accessible\r\n');
    return;
  }else{
    proxy.unregister(req.params[0]);
    proxy.register(req.params[0], 'http://localhost:' + req.params[1], {
      ssl: {
        key: req.body.key,
        cert: req.body.cert,
        ca: req.body.ca
      }
    });
  }
  save(function(r){res.write(r);}, function(){
    res.send('Registered: https://' + req.params[0] + ' => ' + 'http://localhost:' + req.params[1] + '\r\n');
  });
});

app.get(/^\/unregister\/([a-zA-Z0-9\.]+)/, function(req, res){
  proxy.unregister(req.params[0]);
  save(function(r){res.write(r);}, function(){
    res.send('Unregistered: ' + req.params[0] + '\r\n');
  });
});

http.on('listening', function(){
  console.log('listening on %s:%s', http.address().address, http.address().port);
});

//Check that ~/.router and savefile exist
SAVEFILE = expandTilde(SAVEFILE);
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
load(); //Initial load
http.listen(PORT, '127.0.0.1'); //and start the server
