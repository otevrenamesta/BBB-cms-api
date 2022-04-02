import path from 'path'
import express from 'express'
import { APIError } from 'modularni-urad-utils'
const SessionServiceMock = require('modularni-urad-utils/test/mocks/sessionService')

module.exports = (g) => {
  process.env.PORT = 33333
  process.env.NODE_ENV = 'test'
  process.env.SESSION_SERVICE_PORT = 24000
  process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_SERVICE_PORT}`
  const port = Number(process.env.PORT) || 3333
  const dataServerPort = port + 1

  Object.assign(g, {
    baseurl: `http://localhost:${port}`,
    dataurl: `http://localhost:${dataServerPort}`,
    mockUser: { id: 42 },
    sessionBasket: []
  })
  g.sessionSrvcMock = SessionServiceMock.default(process.env.SESSION_SERVICE_PORT, g)
  
  g.InitApp = async function (ApiModule) {
    const auth = require('modularni-urad-utils/auth').default

    const app = express()
    const appContext = { 
      express, auth, 
      bodyParser: express.json(),
      ErrorClass: APIError
    }
    function setupReqConfig (req, res, next) {
      req.tenantid = 'omstredni'
      req.tenantcfg = {
        websites: [
          { domain: 'stredni.web.otevrenamesta.cz', webmastersGroup: 'pokusaci' },
        ]
      }
      next()
    }
    const mwarez = ApiModule.init(appContext)
    app.use(setupReqConfig, mwarez)

    app.use((error, req, res, next) => {
      if (error instanceof APIError) {
        return res.status(error.name).send(error.message)
      }
      console.error(error)
      res.status(500).send(error.message || error.toString())
    })

    return new Promise((resolve, reject) => {
      g.server = app.listen(port, '127.0.0.1', (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
  
  g.close = async function() {
    g.sessionSrvcMock.close()
    g.server.close()
    return
  }
}