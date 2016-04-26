var proxy = require('redbird')({port: 80, xfwd: false});

//There has to be a good way to do this slightly dynamically
// - being able to change things on the fly.

proxy.register("ec2.clive.io","http://localhost:10001");
proxy.register("apcs.clive.io","http://localhost:10002");
proxy.register("sockets.apcs.clive.io","http://localhost:1234");

