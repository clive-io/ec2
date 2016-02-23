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

ROOTDOMAIN = "ec2.clive.io"
def getHost(request):
  host = request.requestHeaders.getRawHeaders('Host', [None])[0].split(':')[0].split('?')[0]
  if host.find(ROOTDOMAIN) != -1:
    return host[:-1-len(ROOTDOMAIN)]
def getURI(request):
  return request.uri.split('?')[0]



def registrar_render(request):
  host =  getHost(request)
  uri = getURI(request)
  if host == "":
    if uri == '/' or uri == '/index.html':
      content = "<h1>Domain Registrations: *." + ROOTDOMAIN + "</h1>"
      if 'domain' in request.args:
        content += "You tried to access ["+request.args['domain'][0]+"]."
      else:
        content += "Hello!"
      return content

def relay_render(request):
  host = getHost(request)
  uri = getURI(request)
  if re.compile('^[a-zA-Z0-9_]+$').match(host):
    realpath = os.path.abspath('serverfiles/'+host+uri)
    rootpath = os.path.abspath('serverfiles/'+host+'/')
    if not os.path.isdir(rootpath):
      request.redirect("https://"+ROOTDOMAIN+"?domain="+host)
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



class Server(resource.Resource):
  isLeaf = True
  def send404(self, request, message=""):
    request.setHeader(b"content-type", b"text/html")
    with open("templates/404.html") as page404:
      out = page404.read()
      out = out.replace("{msg}", message).replace("{url}",request.uri).replace("{rooturl}","https://"+ROOTDOMAIN)
      request.setResponseCode(404)
      return out
  def redirScheme(self, request, newScheme):
    newURLPath = request.URLPath()
    if newURLPath.scheme == newScheme:
      raise ValueError(newScheme+" redirect loop")
    newURLPath.scheme = newScheme
    return util.redirectTo(newURLPath.__str__(), request)

class HTTPS_Server(Server):
  def render(self, request):
    host = getHost(request)
    print("HTTPS, HOST [" + host + "], URI [" + getURI(request) + "]")

    if host == "":
      page = registrar_render(request)
      return self.send404(request) if page is None else page
    elif host != None:
      return self.redirScheme(request, "http")
    else:
      return self.send404(request)

class HTTP_Server(Server):
  def render(self, request):
    host = getHost(request)
    print("HTTP, HOST [" + host + "], URI [" + getURI(request) + "]")

    if host == "":
      return self.redirScheme(request, "https")
    elif re.compile('^[a-zA-Z0-9_]+$').match(host):
      page = relay_render(request)
      return self.send404(request) if page is None else page
    else:
      return self.send404(request)



sslContext = ssl.DefaultOpenSSLContextFactory(
  '/etc/letsencrypt/live/'+ROOTDOMAIN+'/privkey.pem',
  '/etc/letsencrypt/live/'+ROOTDOMAIN+'/cert.pem'
)
reactor.listenTCP(80, server.Site(HTTP_Server()))
reactor.listenSSL(
  443,
  server.Site(HTTPS_Server()),
  contextFactory = sslContext
)

print("Listening on HTTP and HTTPS...")
reactor.run()
