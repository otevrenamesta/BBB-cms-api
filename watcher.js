import chokidar from 'chokidar'
import fs from 'fs'
import path from 'path'
import _ from 'underscore'
import sassRenderer from './sass_render'
import files from './files'

const SYSTEMFILES = {
  // '_service/vendor.js',
  '_service/routes.json': files.listPages,
  '_service/metainfo.json': files.listMetaInfo,
  '_service/style.css': sassRenderer
}

export default function doWatch(DATA_FOLDER) {

  const ch = chokidar.watch(DATA_FOLDER, {})
  
  ch.on('add', async (filepath, stats) => {
    console.log('add: ', filepath, stats)
  })

  ch.on('change', async (filepath, stats) => {
    console.log('change: ', filepath, stats)
  })

  _checkCurrentState(DATA_FOLDER)
}

async function _checkCurrentState(DATA_FOLDER) {
  const webs = await fs.promises.readdir(DATA_FOLDER)
  _.map(webs, webfolder => {
    _.map(SYSTEMFILES, async (callBack, sysfile) => {
      const filepath = path.join(DATA_FOLDER, webfolder, sysfile)
      try {
        const exists = fs.statSync(filepath)
      } catch(err) {
        const content = await callBack(path.join(DATA_FOLDER, webfolder))
        await fs.promises.writeFile(filepath, content)
      }
    })
  })
}



// app.get('/vendor.js', (req, res, next) => {
//   const domain = process.env.DOMAIN || req.hostname
//   files.concatVendorScripts(domain)
//     .then(r => _sendContent(res, r, 'text/javascript')).catch(next)
// })

// app.get('/routes.json', (req, res, next) => {
//   const domain = process.env.DOMAIN || req.hostname
//   const filePath = path.join(DATA_FOLDER, domain)
//   files.listPages(filePath).then(r => res.json(r)).catch(next)
// })

// app.get('/metainfo.json', (req, res, next) => {
//   const domain = process.env.DOMAIN || req.hostname
//   const filePath = path.join(DATA_FOLDER, domain)
//   files.listMetaInfo(filePath).then(r => res.json(r)).catch(next)
// })

// app.get('/style.css', (req, res, next) => {
//   const domain = process.env.DOMAIN || req.hostname
//   buildStyle(domain, DATA_FOLDER)
//     .then(css => _sendContent(res, css, 'text/css')).catch(next)
// })