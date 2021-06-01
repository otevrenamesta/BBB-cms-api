import chokidar from 'chokidar'
import _ from 'underscore'
import fs from 'fs'
import path from 'path'
import MyPathPrivilegeManager from './privilege'
const webdav = require('webdav-server').v2
const hostname = process.env.WEBDAV_HOST || '127.0.0.1'
const webdavPath = process.env.WEBDAV_PATH || '/'
let webDavUsers = null
try {
  webDavUsers = JSON.parse(process.env.WEBDAV_USERS)
} catch (e) {
  throw new Error('process.env.WEBDAV_USERS not valid JSON!')
}

export default (port, DATA_FOLDER) => {
  // User manager (tells who are the users)
  const userManager = new webdav.SimpleUserManager()
  // Privilege manager (tells which users can access which files/folders)
  const privilegeManager = new MyPathPrivilegeManager(webDavUsers)

  _.map(webDavUsers, (domainUsers, domain) => {
    _.map(domainUsers, (pwd, uname) => {
      userManager.addUser(uname, pwd, false)
    })
  })

  const server = new webdav.WebDAVServer({
      httpAuthentication: new webdav.HTTPDigestAuthentication(userManager, 'Default realm'),
      privilegeManager: privilegeManager,
      hostname,
      port
  })
  server.beforeRequest((ctx, next) => {
    console.log('>>', ctx.request.method, ctx.requested.uri, '>', ctx.response.statusCode, ctx.response.statusMessage)
    next()
  })

  function _addFolder (folder, server) {
    const foldr = new webdav.PhysicalFileSystem(folder)
    const domain = path.basename(folder)

    server.setFileSystem(webdavPath + domain, foldr, (success) => {
      console.log(`${folder} mounted on ${webdavPath + domain}`)
    })
  }

  const watchOpts = { depth: 0 }
  chokidar.watch(DATA_FOLDER, watchOpts).on('addDir', async (filepath, stats) => {
    if (filepath === DATA_FOLDER) return
    _addFolder(filepath, server)
  })

  server.start(() => console.log('WEBDAV READY'))
}


