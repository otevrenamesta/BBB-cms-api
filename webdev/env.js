import path from 'path'
process.env.DOMAIN = 'testweb.cz'
process.env.WEBDATA_FOLDER = path.join(__dirname, '.data')
process.env.SESSION_MOCK=3333
process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_MOCK}`