var secrets = require('./secrets.js');
var app = require('express')();
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var PORT = 55923;

app.use(bodyParser.json());

app.post(secrets.path, function (req, res) {
  console.log(req.body);
  exec("curl -s " + secrets.mailapi
  + " -F from='"            + secrets.mailbot + "'"
  + " -F to='"              + secrets.recipients + "'"
  + " -F subject='Mailerr " + secrets.recipients + "'"
  + " -F text='"            + JSON.stringify(req.body) + "\r\n" + secrets.response + "'",
  function(error, stdout, stderr){
    console.log('message: ' + JSON.stringify(req.body));
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    else{
      res.send('stdout: '+ stdout + '\r\nstderr: ' + stderr);
      res.end();
    }
  });
});

app.listen(PORT, 'localhost', function(){
  console.log('Listening on localhost:' + PORT);
});
