import readdirp from 'readdirp'
import path from 'path'
import fs from 'fs'
import _ from 'underscore'
import axios from 'axios'

export async function listPages (filePath) {
  const files = await readdirp.promise(filePath, { fileFilter: '*.yaml' })
  function _createPath(i) {
    let p = '/' + (path.dirname(i.path) === '.' ? '' : path.dirname(i.path))
    return path.basename(i.path) === 'index.yaml' 
      ? p 
      : p + i.path.substr(0, i.path.length - 5)
  }
  return files.filter(i => i.basename !== '404.yaml').map(i => {
    return { 
      path: _createPath(i), 
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

  'https://raw.githubusercontent.com/vencax/bbb-vue-web/master/dist/bbb-web.js'
]

export async function concatVendorScripts () {
  const reqs = await Promise.all(scripts.map(i => axios.get(i)))
  const s = _.reduce(reqs, (acc, i) => {
    return acc + '\n\n' + i.data
  }, '')
  return s
}

export async function renderIndex (hostname) {
  const template = await fs.promises.readFile('./templates/index.html', 'utf8')
  return template.replace(/{{ API_URL }}/g, '/' + hostname)
}