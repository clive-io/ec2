# https://stackoverflow.com/questions/18732250/installing-numpy-on-amazon-ec2
# https://docs.python.org/2/library/simplehttpserver.html
# https://twistedmatrix.com/trac/


from twisted.web import server, resource
from twisted.internet import reactor, endpoints
import re
import os

PROTOCOL = "http"
ROOTDOMAIN = "ec2.clive.io"

class Server(resource.Resource):
  isLeaf = True
  def render_GET(self, request):
    host = request.requestHeaders.getRawHeaders('Host', [None])[0].split(':')[0][:-len("."+ROOTDOMAIN)]
    print "Requested: HOST " + host + ", URI " + request.uri

    request.setHeader(b"content-type", b"text/html")

    if host == "":
      return "MainPage"
    elif re.compile('^[a-zA-Z0-9_]+$').match(host):
      realpath = os.path.abspath('serverfiles/'+host+request.uri)
      rootpath = os.path.abspath('serverfiles/'+host+'/')
      if not os.path.isdir(realpath):
        request.redirect(PROTOCOL+"://"+ROOTDOMAIN)
        request.finish()
        return server.NOT_DONE_YET
      if realpath.startswith(rootpath):
        if request.uri == '/':
          if os.path.isfile(realpath+"index.html"):
            realpath += "index.html"
          elif os.path.isfile(realpath+"index.htm"):
            realpath += "index.htm"
          else:
            return "No index file found. :("
        with open(realpath) as content_file:
          return content_file.read()

    return "404"

endpoints.serverFromString(reactor, "tcp:80").listen(server.Site(Server()))
print "Listening on tcp:80..."
reactor.run()

