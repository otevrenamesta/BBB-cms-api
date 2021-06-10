import express from 'express'
import morgan from 'morgan'
import path from 'path'
import fs from 'fs'
import cors from 'cors'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import { required } from 'modularni-urad-utils/auth'
import initRoutes from './routes'
import initWebDavServer from './webdav/server.js'

export async function init (authmocks = null) {
  const app = express()
  const auth = authmocks ? authmocks : { required }
  process.env.NODE_ENV !== 'production' && app.use(morgan())
  app.use(cors())

  let DATA_FOLDER = process.env.DATA_FOLDER
  try {
    DATA_FOLDER = path.resolve(DATA_FOLDER)
    fs.statSync(DATA_FOLDER)
  } catch (_) {
    throw new Error(`DATA_FOLDER ${process.env.DATA_FOLDER} not exists!`)
  }

  initRoutes({ express, auth, app, DATA_FOLDER })
  
  process.env.WEBDAV_PORT 
    && initWebDavServer(process.env.WEBDAV_PORT, DATA_FOLDER)

  initErrorHandlers(app) // ERROR HANDLING
  return app
}

if (process.env.NODE_ENV !== 'test') {
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3000
  const mocks = process.env.SESSION_MOCK ? {
    required: (req, res, next) => {
      req.user = JSON.parse(process.env.SESSION_MOCK)
      next()
    }
  }: null
  init(mocks).then(app => {
    app.listen(port, host, (err) => {
      if (err) throw err
      console.log(`frodo do magic on ${host}:${port}`)
    })
  }).catch(err => {
    console.error(err)
  })
}