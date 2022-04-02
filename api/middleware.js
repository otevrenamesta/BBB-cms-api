import axios from 'axios'
import _ from 'underscore'
import yaml from 'yaml'

export default { update, create }

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
