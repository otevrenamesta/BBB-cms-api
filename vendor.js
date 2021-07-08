import axios from 'axios'
import fs from 'fs'
import _ from 'underscore'

const scripts = [
  'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/locale/cs.min.js',
  'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.2/vuex.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.1.3/vue-router.min.js',
  'https://unpkg.com/vue-meta@2.4.0/dist/vue-meta.js',
  'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.0.0/js-yaml.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/marked/2.0.1/marked.min.js',
  'https://raw.githubusercontent.com/otevrenamesta/bbb-vue-web/master/dist/bbb-web.js'
]

export default async function concatVendorScripts (outfile) {
  if (!process.env.OUTFILE && !outfile) {
    throw new Error('process.env.OUTFILE is mandatory')
  }
  const OUTFILE = outfile || process.env.OUTFILE
  const reqs = await Promise.all(scripts.map(i => axios.get(i)))
  const content = _.reduce(reqs, (acc, i) => {
    return acc + '\n\n' + i.data
  }, '')
  fs.promises.writeFile(OUTFILE, content, 'utf8')
}

process.env.OUTFILE && concatVendorScripts(process.env.OUTFILE)
  .then(() => {
    console.log('done')
  })
  .catch(err => {
    console.error(err)
  })
