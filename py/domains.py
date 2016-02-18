# Domain Server
# Receives requests from * dns.
# Processes these and makes a domain registration service available.
# Copyright (c) 2016, Clive Chan
# MIT License

from twisted.web import server, resource, util
from twisted.internet import reactor, endpoints, ssl
from twisted.python import urlpath
import re
import os
import shutil
import mimetypes

# HTTPS:
# letsencrypt.org/howitworks
# blog.vrplumber.com/b/2004/09/26/howto-create-an-ssl/

PORT = 443
PROTOCOL = "https"
ROOTDOMAIN = "ec2.clive.io"

class Server(resource.Resource):
  isLeaf = True
  def send404(self, request, message=""):
    request.setHeader(b"content-type", b"text/html")

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
              request.setHeader(b"content-type", b"text/html")
              return content_file.read().replace("{host}", host)

        contenttype = mimetypes.guess_type(uri)[0]
        request.setHeader(b"content-type", contenttype)

        if os.path.isfile(realpath):
          with open(realpath) as content_file:
            return content_file.read()

    return self.send404(request)

sslContext = ssl.DefaultOpenSSLContextFactory(
  '/etc/letsencrypt/live/ec2.clive.io/privkey.pem',
  '/etc/letsencrypt/live/ec2.clive.io/cert.pem'
)
print "Listening on port", PORT, "..."

# stackoverflow.com/a/6064270/1181387
class HTTPRedirect(resource.Resource):
  isLeaf = False
  def __init__(self):
    resource.Resource.__init__(self)
    self.newScheme = "https"
  def render(self, request):
    newURLPath = request.URLPath()
    if newURLPath.scheme == self.newScheme:
      raise ValueError("Redirect loop")
    newURLPath.scheme = self.newScheme
    return util.redirectTo(newURLPath.__str__(), request)
  def getChild(self, name, request):
    return self

reactor.listenTCP(80, server.Site(HTTPRedirect()))
reactor.listenSSL(
  PORT,
  server.Site(Server()),
  contextFactory = sslContext
)
reactor.run()
