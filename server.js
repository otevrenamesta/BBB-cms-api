import express from 'express'
import morgan from 'morgan'
import path from 'path'
import cors from 'cors'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import initAuth from 'modularni-urad-utils/auth'
import initRoutes from './routes'
import initWebDavServer from './webdavServer.js'

export async function init () {
  const app = express()
  const auth = initAuth(app)
  process.env.NODE_ENV !== 'production' && app.use(morgan())
  app.use(cors())

  const DATA_FOLDER = path.resolve(process.env.DATA_FOLDER || './data')

  initRoutes({ express, auth, app, DATA_FOLDER })
  
  process.env.WEBDAV_PORT 
    && initWebDavServer(process.env.WEBDAV_PORT, DATA_FOLDER)

  initErrorHandlers(app) // ERROR HANDLING
  return app
}

if (process.env.NODE_ENV !== 'test') {
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3000
  init().then(app => {
    app.listen(port, host, (err) => {
      if (err) throw err
      console.log(`frodo do magic on ${host}:${port}`)
    })
  }).catch(err => {
    console.error(err)
  })
}

if (process.env.SESSION_MOCK) require('modularni-urad-utils/mocks/auth')()
