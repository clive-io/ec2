var proxy = require('redbird')({port: 80, xfwd: false});

proxy.register("ec2.clive.io","http://localhost:10001");
proxy.register("apcs.ec2.clive.io","http://localhost:10002");
proxy.register("live.lexscibowl.org","http://localhost:10003");
