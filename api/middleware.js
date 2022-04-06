import axios from 'axios'
import _ from 'underscore'
import yaml from 'yaml'

const TOKEN_URL = process.env.FILESTORAGE_ACCESS_TOKEN_URL
if (!TOKEN_URL) throw new Error('env.FILESTORAGE_ACCESS_TOKEN_URL not set')

export default { update, create, uploadInfo }

async function update (file, id, body, ErrorClass) {
  const pathParts = id.split('.')
  const srcReq = await axios.get(file)
  const tree = yaml.parse(srcReq.data)
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
  const desiredPath = `${schema}/_webdata/${web}/pages`
  const tokenUrl = TOKEN_URL.replace('{{TENANTID}}', schema)
  const req = await axios.get(tokenUrl, { data: { paths: [ `${desiredPath}/*` ] } })
  return {
    path: desiredPath,
    token: req.data.token
  }
}