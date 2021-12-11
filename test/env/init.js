import path from 'path'
import express from 'express'
import { initErrorHandlers, APIError } from 'modularni-urad-utils'
import cleanup from './cleanup'
const SessionServiceMock = require('modularni-urad-utils/test/mocks/sessionService')

module.exports = (g) => {
  process.env.PORT = 33333
  process.env.NODE_ENV = 'test'
  process.env.DATA_FOLDER = path.resolve(path.dirname(__filename), '../data')
  process.env.WEBDAV_USERS = JSON.stringify({
    "testdomain.cz": { "gandalf":"mordor" },
    "testdomain2.cz":{ "frodo":"shire" }
  })
  process.env.WEBDAV_PORT = 44444
  process.env.WEBDAV_PATH = '/webdav/'
  process.env.SESSION_SERVICE_PORT = 24000
  process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_SERVICE_PORT}`
  const port = Number(process.env.PORT) || 3333
  const dataServerPort = port + 1

  Object.assign(g, {
    baseurl: `http://localhost:${port}`,
    dataurl: `http://localhost:${dataServerPort}`,
    mockUser: { id: 42 },
    sessionBasket: [],
    createdFiles: []
  })
  g.require = function(name) {
    try {
      return require(name)
    } catch (err) {
      console.error(err)
    }    
  }
  g.sessionSrvcMock = SessionServiceMock.default(process.env.SESSION_SERVICE_PORT, g)
  
  g.InitApp = async function (ApiModule) {
    const auth = require('modularni-urad-utils/auth').default
    await ApiModule.migrateDB()

    const app = express()
    const appContext = { 
      express, auth, 
      bodyParser: express.json(),
      ErrorClass: APIError,
      require: function(name) {
        try {
          return require(name)
        } catch (err) {
          console.error(err)
        }    
      }
    }
    function setupReqConfig (req, res, next) {
      req.tenantcfg = {
        websites: [
          { domain: 'testdomain.cz', webmastersGroup: 'pokusaci' },
          { domain: 'testdomain2.cz', webmastersGroup: 'pokusaci2' }
        ]
      }
      next()
    }
    const mwarez = ApiModule.init(appContext)
    app.use(setupReqConfig, mwarez)

    initErrorHandlers(app)

    return new Promise((resolve, reject) => {
      g.server = app.listen(port, '127.0.0.1', (err) => {
        if (err) return reject(err)

        const dataApp = express().use(express.static(process.env.DATA_FOLDER))
        g.dataServer = dataApp.listen(dataServerPort, '127.0.0.1')

        resolve()
      })
    })
  }
  
  g.close = async function() {
    g.sessionSrvcMock.close()
    g.server.close()
    g.dataServer.close()
    await cleanup(process.env.DATA_FOLDER)
    return
  }
}