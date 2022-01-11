import express from 'express'
import path from 'path'
import { migrateDB, init as init } from '../index'
import Prepare from './prepare'

async function doInit () {
  const g = {}
  const app = express()
  await Prepare()
  const staticFolder = path.join(process.env.WEBDATA_FOLDER, process.env.DOMAIN)
  app.use('/data', express.static(staticFolder))
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

  // g.sessionSrvcMock = SessionServiceMock(process.env.SESSION_SERVICE_PORT, g)
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 8080
  await migrateDB()
  // const apiapp = init({})
  // app.use('/api', apiapp)
  g.server = app.listen(port, '127.0.0.1', (err) => {
    if (err) throw err
    console.log(`frodo do magic on ${host}:${port}`)
  })
}

doInit()
