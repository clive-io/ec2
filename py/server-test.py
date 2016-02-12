# https://twistedmatrix.com/trac/

from twisted.web import server, resource
from twisted.internet import reactor, endpoints
class Counter(resource.Resource):
  isLeaf = True
  numberRequests = 0
  def render_GET(self, request):
    print "Requested: ", request.uri
    self.numberRequests += 1
    request.setHeader(b"content-type",b"text/plain")
    content = u"I am request #{}\n".format(self.numberRequests)
    return content.encode("ascii")

endpoints.serverFromString(reactor, "tcp:80").listen(server.Site(Counter()))
print "Listening on tcp:80..."
reactor.run()
