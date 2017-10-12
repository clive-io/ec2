EC2 Server Suite
================
Copyright (c) 2016 Clive Chan.
MIT license.

A collection of programs (mostly in NodeJS) that I use to admin my EC2 server. You can also browse the [clive-io github org](https://github.com/clive-io).

External repos
--------------
  - [clive-io/pixel](https://github.com/clive-io/pixel) - Implementation of invisible tracking pixels in email messages.
  - [clive-io/cloudflare-middleware](https://github.com/clive-io/cloudflare-middleware) - NPM package containing middleware to deny non-CloudFlare requests and restore origin ip to `req.origin_ip`. Deprecated in favor of [trust proxy](https://github.com/clive-io/pixel/blob/9f9bb99815e8205978ae692e01a58d97501efd81/index.coffee#L3-L8).
  - [clive-io/statbot](https://github.com/clive-io/statbot) - NPM package that helps forward important information from server logs, etc. to Facebook Messenger.
  - [clive-io/clive.io-statbot](https://github.com/clive-io/clive.io-statbot) - A reference implementation using `statbot` that actually runs in production on my servers.
  - [clive-io/clive.io](https://github.com/clive-io/clive.io) - My personal website.
  - [clive-io/uphook](https://github.com/clive-io/uphook) - NPM package containing Express middleware to automatically update and restart an application based on a github/gitlab webhook.
  - [clive-io/ec2-router](https://github.com/clive-io/ec2-router) - A reverse proxy server that I use for all my EC2 websites; contains command-line interface to change routes on the fly and autosaving functionality.
  - [clive-io/ec2-mailerr](https://github.com/clive-io/ec2-mailerr) - A monitor for Mailgun error webhooks, which will email me if my cc@clive.io email bounces due to my unconventional email setup.
  - [clive-io/ec2-py-registrar](https://github.com/clive-io/ec2-py-registrar) - A for-fun project (kind of built for [lex.ma](http://lex.ma)) that allows registration of subdomains and securely jailed FTP uploading of website files.
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
