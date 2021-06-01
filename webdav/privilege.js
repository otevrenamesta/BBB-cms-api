import _ from 'underscore'
const webdav = require('webdav-server').v2

const readRights = [
  'canRead', 
  'canReadLocks', 
  'canReadContent', 
  'canReadProperties', 
  'canReadContentTranslated', 
  'canReadContentSource'
]

export default class MyPathPrivilegeManager extends webdav.SimplePathPrivilegeManager {

  constructor(webDavUsers) {
    super()
    this.webDavUsers = webDavUsers
  }

  getRights(user, path) {
    if (!user.isDefaultUser) {
      const pathParts = path.substr(process.env.WEBDAV_PATH.length).split('/')
      const domain = pathParts.length > 0 ? pathParts[0] : false
      if (domain && user.username in (this.webDavUsers[domain] || {})) {
        console.log(user.username, path);
        return [ 'all' ]
      }
    }
    return readRights
  }

}