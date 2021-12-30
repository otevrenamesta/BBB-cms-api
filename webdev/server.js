import express from 'express'
import path from 'path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import InitAPI from '../index'
import Prepare from './prepare'

async function init () {
  const g = {}
  const app = express()
  await Prepare()
  const staticFolder = path.join(process.env.WEBDATA_FOLDER, process.env.DOMAIN)
  app.use('/data', express.static(staticFolder))
  try {
    const proxies = JSON.parse(process.env.PROXIES)
    for (let i in proxies) {
      app.use(i, createProxyMiddleware({ target: proxies[i], changeOrigin: true }))
    }
  } catch (_) {}
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

  // g.sessionSrvcMock = SessionServiceMock(process.env.SESSION_SERVICE_PORT, g)
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 8080
  InitAPI().then(apiapp => {
    app.use('/api', apiapp)
    g.server = app.listen(port, '127.0.0.1', (err) => {
      if (err) throw err
      console.log(`frodo do magic on ${host}:${port}`)
    })
  })
}

init()
