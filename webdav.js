const webdav = require('webdav-server').v2
const server = new webdav.WebDAVServer()

export default (FOLDER) => {
  const foldr = new webdav.PhysicalFileSystem(FOLDER)

  server.setFileSystem('/', foldr, (success) => {
    console.log(`${FOLDER} mounted`)
  })
  return webdav.extensions.express('/style', server)
}
