import express from 'express'
import morgan from 'morgan'
import path from 'path'
import fs from 'fs'
import cors from 'cors'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import { required, requireMembership } from 'modularni-urad-utils/auth'
import initRoutes from './routes'
import initWebDavServer from './webdav/server.js'

export default async function init () {
  const app = express()
  const auth = { required, requireMembership }
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