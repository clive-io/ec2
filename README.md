AWS Testing
===========
Copyright (c) 2016 Clive Chan.
MIT license.

A few things that I use on my EC2 server, most importantly the router.

router
------
The node server on which all the other web-based stuff on my ec2 machine depends.
Opens up local port 10000 which can be used to register domains in a reverse proxy server. For example:

    curl -sS localhost:10000/register/apcs.clive.io/10002        # Registers incoming requests directed at apcs.clive.io to go to the apcs server running on port 10002.
    curl -sS -X POST localhost:10000/register/ssl.clive.io/10443 # Registers incoming requests directed at HTTPS. Optionally POST some SSL options: key, cert, ca. See the default config (top of router.js) for example.
    curl -sS localhost:10000/unregister/apcs.clive.io            # Unregisters apcs.clive.io, so that visitors will see simply "Not Found"

Automatically saves to and loads from `~/.router/save.json`.

### Useful for security
  - [Qualys SSL Server Test](https://www.ssllabs.com/ssltest/)
  - [StartSSL](https://startssl.com/) (gotta renew once a year)
  - [CloudFlare](https://www.cloudflare.com) (also, can use Origin CA here instead of StartSSL)
  - [Domain Security Check](https://www.cloudflare.com/domain-security-check/) (not that there's much I can do about it)
  - At some point I need to add `helmet` from NPM but not sure how to delve into the RedBird code. Maybe it's just using plain old `http` not Express.

aws-setup.sh
------------
Poorly updated. A copy of the commands that I used to bootstrap the Amazon Linux EC2 server from scratch.

node
----
Just a test server, nothing fancy.

py
--
A rather complex arrangement in which you can register domains *.ec2.clive.io and upload stuff to them via FTP.
