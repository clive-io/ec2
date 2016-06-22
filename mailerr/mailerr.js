var secrets = require('secrets.js');
var nodemailer = require('nodemailer');
var app = require('express')();
var bodyParser = require('body-parser');
var PORT = 55923;

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

app.use(bodyParser.json()); // for parsing application/json

app.post(secret.path, function (req, res) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: secrets.mailbot, // sender address
      to: secrets.recipients, // list of receivers
      subject: 'Mail error for ' + secrets.recipients, // Subject line
      text: JSON.stringify(req.body, null, 4) // plaintext body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
});

app.listen(PORT, 'localhost', function(){
  console.log('Listening on localhost:'+PORT);
});
