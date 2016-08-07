AWS Testing
===========
Copyright (c) 2016 Clive Chan.
MIT license.

A few things that I use on my EC2 server.

External repos
--------------
  - **ec2-router** [cchan/ec2-router](https://github.com/cchan/ec2-router)
  - **ec2-mailerr** [cchan/ec2-mailerr](https://github.com/cchan/ec2-mailerr)
  - **ec2-py-registrar** [cchan/ec2-py-registrar](https://github.com/cchan/ec2-py-registrar)

Here
----
  - **aws-setup.sh** Poorly updated. A copy of the commands that I used to bootstrap the Amazon Linux EC2 server from scratch.
  - **node** Just a test server, nothing fancy.

Useful for general security
---------------------------
  - [Qualys SSL Server Test](https://www.ssllabs.com/ssltest/)
  - [StartSSL](https://startssl.com/) (gotta renew once a year)
  - [CloudFlare](https://www.cloudflare.com) (also, can use Origin CA here instead of StartSSL)
  - [Domain Security Check](https://www.cloudflare.com/domain-security-check/) (not that there's much I can do about it)
  - At some point I need to add `helmet` from NPM but not sure how to delve into the RedBird code. Maybe it's just using plain old `http` not Express.

