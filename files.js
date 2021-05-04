import readdirp from 'readdirp'
import path from 'path'
import fs from 'fs'
import _ from 'underscore'
import axios from 'axios'
import yaml from 'yaml'

export default {
  listPages, concatVendorScripts, renderIndex, update, create
}

async function listPages (filePath) {
  const files = await readdirp.promise(filePath, { fileFilter: '*.yaml' })
  return files.filter(i => i.basename !== '404.yaml').map(i => {
    return {
      path: '/' + i.path.replace(/.yaml$/g, '').replace(/index$/g, ''),
      data: i.path
    }
  })
}

//   {path: "/", data: "index.yaml"},

const scripts = [
  'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/locale/cs.min.js',
  'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.2/vuex.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.1.3/vue-router.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.0.0/js-yaml.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/marked/2.0.1/marked.min.js',
  'https://unpkg.com/vue-final-modal@2.1.0/dist/VueFinalModal.umd.js',
  'https://raw.githubusercontent.com/vencax/bbb-vue-web/master/dist/bbb-web.js'
]

async function concatVendorScripts () {
  const reqs = await Promise.all(scripts.map(i => axios.get(i)))
  const s = _.reduce(reqs, (acc, i) => {
    return acc + '\n\n' + i.data
  }, '')
  return s
}

const API = process.env.API || '/api/'
async function renderIndex (hostname) {
  const template = await fs.promises.readFile('./templates/index.html', 'utf8')
  const noScript = 'Your browser does not support JavaScript!'
  return template
    .replace(/{{ API_URL }}/g, API + hostname)
    .replace(/{{ NOSCRIPT }}/g, noScript)
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
  const filePath = path.join(path.resolve(datafolder), webid, `${body.path}.yaml`)
  try {
    await fs.promises.stat(filePath)
    throw new Error('already exists')
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
    const now = (new Date()).toISOString()
    const data = `UID: ${UID}\ncreated_at: ${now}\nlayout: page`
    await fs.promises.writeFile(filePath, data, 'utf8')
    return data
  }
}
