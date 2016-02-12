from pyftpdlib.authorizers import DummyAuthorizer as FTPAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer
# import users

authorizer = FTPAuthorizer()
authorizer.add_user("user","12345","serverfiles/hello",perm="elradfmw")

handler = FTPHandler
handler.authorizer = authorizer
handler.masquerade_address = '54.152.214.231'
handler.passive_ports = [50000, 51000]

server = FTPServer(('', 21), handler)
server.serve_forever()
