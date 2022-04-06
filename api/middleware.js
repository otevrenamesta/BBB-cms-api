import axios from 'axios'
import _ from 'underscore'
import yaml from 'yaml'
import { TOKEN_URL } from '../consts'

export default { update, create, uploadInfo }

async function loadContent (file, ErrorClass) {
  try {
    const res = await axios.get(file)
    return res.data
  } catch (_) {
    throw new ErrorClass(400, `could not get file ${file} from storage`)
  }
}

async function update (file, id, body, ErrorClass) {
  const pathParts = id.split('.')
  const tree = yaml.parse(await loadContent(file, ErrorClass))
  const subTree = _.get(tree, pathParts)
  if (!subTree) throw new ErrorClass(`Nothing found on path: ${id}`)
  Object.assign(subTree, body)
  tree.updated_at = (new Date()).toISOString()
  return yaml.stringify(tree)
}

async function create (UID) {
  const now = (new Date()).toISOString()
  const data = `UID: ${UID}
created_by: ${UID}
created_at: ${now}
layout: page
children:`
  return data
}

async function uploadInfo (web, user, schema) {
  const desiredPath = `/_webdata/${web}/pages`
  const tokenUrl = TOKEN_URL.replace('{{TENANTID}}', schema)
  const req = await axios.get(tokenUrl, { data: { paths: [ `${desiredPath}/*` ] } })
  return {
    path: req.data.path + desiredPath,
    token: req.data.token
  }
}