import path from 'path'
process.env.PORT = 33333
process.env.NODE_ENV = 'test'
process.env.DATA_FOLDER = path.resolve(path.dirname(__filename), '../data')
process.env.DOMAIN = 'testdomain.cz'
process.env.WEBDAV_PORT = 44444