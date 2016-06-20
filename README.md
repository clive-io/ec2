AWS Testing
===========
Copyright (c) 2016 Clive Chan.
MIT license.

A few things that I use on my EC2 server.

aws-setup.sh
------------
Poorly updated. A copy of the commands that I used to bootstrap the Amazon Linux EC2 server from scratch.

node
----
Just a test server, nothing fancy.

py
--
A rather complex arrangement in which you can register domains *.ec2.clive.io and upload stuff to them via FTP.

router
------
The node server on which all the other web-based stuff on my ec2 machine depends.
Opens up local port 10000 which can be used to register domains in a reverse proxy server. For example:

    curl -sS localhost:10000/register/apcs.clive.io/10080        # Registers incoming requests directed at apcs.clive.io to go to the apcs server running on port 10002.
    curl -sS -X POST localhost:10000/register/ssl.clive.io/10443 # Registers incoming requests directed at HTTPS. Optionally POST some SSL options: key, cert, ca. See the default config (top of router.js) for example.
    curl -sS localhost:10000/unregister/apcs.clive.io            # Unregisters apcs.clive.io, so that visitors will see simply "Not Found"
