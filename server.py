# https://stackoverflow.com/questions/18732250/installing-numpy-on-amazon-ec2

# https://docs.python.org/2/library/simplehttpserver.html

import SimpleHTTPServer
import SocketServer

PORT = 80

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("",PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()

