import readdirp from 'readdirp'
import path from 'path'
import fs from 'fs'
import _ from 'underscore'
import yaml from 'yaml'

export default { listPages, listMetaInfo, update, create, fileList, writeFile }

async function listPages (filePath) {
  const files = await readdirp.promise(filePath, { fileFilter: '*.yaml' })
  return JSON.stringify(files
    .filter(i => i.basename !== '404.yaml' && i.path.indexOf('_service') < 0)
    .map(i => {
      return {
        path: '/' + i.path.replace(/.yaml$/g, '').replace(/index$/g, ''),
        data: i.path
      }
    }))
}

async function fileList (domain, folder, filter, datafolder) {
  const filePath = path.join(datafolder, domain, folder)
  const files = await readdirp.promise(filePath, { fileFilter: filter })
  return JSON.stringify(_.map(files, i => {
    return i.path
  }))
}

async function listMetaInfo (filePath) {
  const files = await readdirp.promise(filePath, { fileFilter: '*.yaml' })
  const data = {}
  await Promise.all(files.filter(i => i.basename !== '404.yaml').map(i => {
    return fs.promises.readFile(i.fullPath, 'utf8').then(fileContent => {
      try {
        const tree = yaml.parse(fileContent)
        data[i.path] = { title: tree.title, desc: tree.desc }
      } catch (e) {
        data[i.path] = { title: 'invalid YAML', desc: e }
      }
    })
  }))
  return JSON.stringify(data)
}

// async function renderIndex (hostname) {
//   const template = await fs.promises.readFile('./templates/index.html', 'utf8')
//   const noScript = 'Your browser does not support JavaScript!'
//   return template.replace(/{{ NOSCRIPT }}/g, noScript)
// }

function writeFile (webid, file, body, datafolder) {
  if (!file.match(/^_service\/.*/)) throw new Error('forbidden file')
  const filePath = path.join(datafolder, webid, file)
  return fs.promises.writeFile(filePath, body.content, 'utf8')
}

async function update (webid, file, id, body, datafolder) {
  const pathParts = id.split('.')
  // const filename = pathParts[0] === '/' ? 'index.yaml' : `${pathParts[0]}.yaml`
  const filePath = path.join(path.resolve(datafolder), webid, file)

  const src = await fs.promises.readFile(filePath, 'utf8')
  const tree = yaml.parse(src)
  const subTree = _.get(tree, pathParts)
  if (!subTree) throw new Error(`Nothing found on path: ${id}`)
  Object.assign(subTree, body)
  const newSrc = yaml.stringify(tree)
  await fs.promises.writeFile(filePath, newSrc, 'utf8')
}

async function create (webid, body, UID, datafolder) {
  const parent = body.parent ? path.dirname(body.parent) : ''
  const filePath = path.join(path.resolve(datafolder), webid, parent, `${body.path}.yaml`)
  try {
    await fs.promises.stat(filePath)
    throw new Error('already exists')
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
    const now = (new Date()).toISOString()
    const data = `UID: ${UID}\ncreated_at: ${now}\nlayout: page\nchildren:`
    await fs.promises.writeFile(filePath, data, 'utf8')
    return data
  }
}
