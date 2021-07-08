/* global describe before after */
// const fs = require('fs')
import chai from 'chai'
import express from 'express'
import path from 'path'

import SessionServiceMock from 'modularni-urad-utils/mocks/sessionService'
import cleanup from './utils/cleanup'
import init from '../index'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const port = Number(process.env.PORT) || 3333
const dataServerPort = port + 1
const g = {
  baseurl: `http://localhost:${port}`,
  dataurl: `http://localhost:${dataServerPort}`,
  mockUser: { id: 42 },
  sessionBasket: [],
  createdFiles: []
}
const staticFolder = path.join(process.env.DATA_FOLDER, process.env.DOMAIN)
const dataApp = express().use(express.static(staticFolder))

describe('app', () => {
  before(done => {
    g.sessionSrvcMock = SessionServiceMock(process.env.SESSION_SERVICE_PORT, g)
    init().then(app => {
      g.server = app.listen(port, '127.0.0.1', (err) => {
        if (err) return done(err)
        setTimeout(done, 500)
      })
      g.dataServer = dataApp.listen(dataServerPort, '127.0.0.1')
    }).catch(done)
  })
  after(done => {
    cleanup(process.env.DATA_FOLDER)
    g.server.close(err => {
      return err ? done(err) : done()
    })
    g.dataServer.close()
  })

  describe('API', () => {
    //
    const submodules = [
      // './webdav', 
      './watcher',
      './routes'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
