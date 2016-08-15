EC2 (various testing things for my EC2 server)
==============================================
Copyright (c) 2016 Clive Chan.
MIT license.

A few things that I use on my EC2 server.

External repos
--------------
  - [cchan/ec2-router](https://github.com/cchan/ec2-router) - A reverse proxy server that I use for all my EC2 websites; contains command-line interface to change routes on the fly and autosaving functionality.
  - [cchan/ec2-mailerr](https://github.com/cchan/ec2-mailerr) - A monitor for Mailgun error webhooks, which will email me if my cc@clive.io email bounces due to my unconventional email setup.
  - [cchan/ec2-py-registrar](https://github.com/cchan/ec2-py-registrar) - A for-fun project (kind of built for [lex.ma](http://lex.ma)) that allows registration of subdomains and securely jailed FTP uploading of website files.
  - [cchan/tensorflow-experiments](https://github.com/cchan/tensorflow-experiments) - Experiments with the TensorFlow library in Python; no cohesive project yet.
  - [cchan/misc: .bashrc](https://github.com/cchan/misc/blob/master/bashrc/.bashrc) - The `.bashrc` file I always use. Includes self-updating functionality, ultra-short Git shortforms, "git-status-all" on all git repositories under a given directory, and more.

In this repo
------------
  - **aws-setup.sh** Poorly updated. A copy of the commands that I used to bootstrap the Amazon Linux EC2 server from scratch.
  - **node** Just a test server, nothing fancy.

Useful for general security that I want to use at some point
------------------------------------------------------------
  - [Qualys SSL Server Test](https://www.ssllabs.com/ssltest/)
  - [StartSSL](https://startssl.com/) (gotta renew once a year)
  - [CloudFlare](https://www.cloudflare.com) - try to use Origin CA here instead of StartSSL (or lack of SSL)
  - [Domain Security Check](https://www.cloudflare.com/domain-security-check/) (not that there's much I can do about it)
  - npm install helmet (for Express)
  - bithound.io
  - snyk.io
