/* global describe before after */
// const fs = require('fs')
import chai from 'chai'
import express from 'express'
import path from 'path'

import cleanup from './utils/cleanup'
import init from '../index'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const port = Number(process.env.PORT) || 3333
const dataServerPort = port + 1
const g = {
  baseurl: `http://localhost:${port}`,
  dataurl: `http://localhost:${dataServerPort}`,
  UID: 110,
  usergroups: [],
  createdFiles: []
}
const mocks = {
  auth: {
    required: (req, res, next) => { return next() },
    requireMembership: (gid) => (req, res, next) => {
      return g.usergroups.indexOf(gid) >= 0 ? next() : next(403)
    },
    getUID: (req) => g.UID
  }
}
const staticFolder = path.join(process.env.DATA_FOLDER, process.env.DOMAIN)
const dataApp = express().use(express.static(staticFolder))

describe('app', () => {
  before(done => {
    init(mocks).then(app => {
      g.server = app.listen(port, '127.0.0.1', (err) => {
        if (err) return done(err)
        setTimeout(done, 1500)
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
      // './routes',
      './watcher'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
