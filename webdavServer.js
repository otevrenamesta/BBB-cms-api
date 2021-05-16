import chokidar from 'chokidar'
import _ from 'underscore'
import fs from 'fs'
import path from 'path'
const webdav = require('webdav-server').v2
const host = process.env.WEBDAV_HOST || '127.0.0.1'

export default (port, DATA_FOLDER) => {
  // User manager (tells who are the users)
  const userManager = new webdav.SimpleUserManager()
  // Privilege manager (tells which users can access which files/folders)
  const privilegeManager = new webdav.SimplePathPrivilegeManager()

  const server = new webdav.WebDAVServer({
      httpAuthentication: new webdav.HTTPDigestAuthentication(userManager, 'Default realm'),
      privilegeManager: privilegeManager,
      host,
      port
  })

  function _addFolder (folder, server) {
    const foldr = new webdav.PhysicalFileSystem(folder)
    const domain = path.basename(folder)

    // add domain webdav users
    const userFile = path.join(folder, 'webdav_users.json')
    const users = fs.readFileSync(userFile)
    _.map(JSON.parse(users), i => {
      const user = userManager.addUser(i.username, i.password, false)
      privilegeManager.setRights(user, '/', [ 'all' ])
    })

    server.setFileSystem('/' + domain, foldr, (success) => {
      console.log(`${folder} mounted`)
    })
  }

  const watchOpts = { depth: 0 }
  chokidar.watch(DATA_FOLDER, watchOpts).on('addDir', async (filepath, stats) => {
    if (filepath === DATA_FOLDER) return
    _addFolder(filepath, server)
  })

  server.start(() => console.log('WEBDAV READY'))
}


