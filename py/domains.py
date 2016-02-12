# Domain Server
# Receives requests from * dns.
# Processes these and makes a domain registration service available.
# Copyright (c) 2016, Clive Chan
# MIT License

from twisted.web import server, resource
from twisted.internet import reactor, endpoints
import re
import os
import shutil

PROTOCOL = "http"
ROOTDOMAIN = "ec2.clive.io"

class Server(resource.Resource):
  isLeaf = True
  def send404(self, request, message=""):
    with open("templates/404.html") as page404:
      out = page404.read()
      out = out.replace("{msg}", message) \
        .replace("{url}",request.uri) \
        .replace("{rooturl}",PROTOCOL+"://"+ROOTDOMAIN)
      
      request.setResponseCode(404)
      
      return out
  def render_GET(self, request):
    host = request.requestHeaders.getRawHeaders('Host', [None])[0].split(':')[0].split('?')[0]
    if host.find(ROOTDOMAIN) == -1:
      return self.send404(request, "Unexpected hostname.")

    uri = request.uri.split('?')[0]

    host = host[:-len("."+ROOTDOMAIN)]
    print "Requested: HOST [" + host + "], URI [" + uri + "]"

    request.setHeader(b"content-type", b"text/html")

    if host == "":
      if uri == '/' or uri == '/index.html':
        content = "<h1>Domain Registrations: *." + ROOTDOMAIN + "</h1>"
        if 'domain' in request.args:
          content += "You tried to access ["+request.args['domain'][0]+"]."
        else:
          content += "Hello!"
        return content
      return self.send404(request)
    elif re.compile('^[a-zA-Z0-9_]+$').match(host):
      realpath = os.path.abspath('serverfiles/'+host+uri)
      rootpath = os.path.abspath('serverfiles/'+host+'/')
      if not os.path.isdir(rootpath):
        request.redirect(PROTOCOL+"://"+ROOTDOMAIN+"?domain="+host)
        request.finish()
        return server.NOT_DONE_YET
      if realpath.startswith(rootpath):
        if uri == '/':
          if os.path.isfile(realpath+"/index.html"):
            realpath += "/index.html"
          elif os.path.isfile(realpath+"/index.htm"):
            realpath += "/index.htm"
          else:
            with open("templates/index.html") as content_file:
              return content_file.read().replace("{host}", host)

        if os.path.isfile(realpath):
          with open(realpath) as content_file:
            return content_file.read()

    return self.send404(request)

endpoints.serverFromString(reactor, "tcp:80").listen(server.Site(Server()))
print "Listening on tcp:80..."
reactor.run()

