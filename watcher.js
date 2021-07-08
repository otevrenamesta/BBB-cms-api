import chokidar from 'chokidar'
import fs from 'fs'
import path from 'path'
import _ from 'underscore'
import sassRenderer from './sass_render'
import files from './files'

const SYSTEMFILES = {
  '_service/routes.json': files.listPages,
  '_service/metainfo.json': files.listMetaInfo,
  '_service/style.css': sassRenderer
}
const STYLE = _.pick(SYSTEMFILES, '_service/style.css')
const META = _.pick(SYSTEMFILES, '_service/metainfo.json')

export default function doWatch(DATA_FOLDER) {

  const ch = chokidar.watch(DATA_FOLDER, {
    ignored: _.map(_.keys(SYSTEMFILES), i => `**/${i}`),
    ignoreInitial: true
  })
  const r = /\/(?<domain>[^\/]*)\/(?<file>.*)$/
  function _getInfo (filepath) {
    return filepath.substring(DATA_FOLDER.length).match(r).groups
  }
  
  ch.on('add', async (filepath, stats) => {
    const { domain, file } = _getInfo(filepath)
    if (file.indexOf('_service') !== 0) {
      _runBuilders(_.omit(SYSTEMFILES, '_service/style.css'), domain, DATA_FOLDER)
    }
  })

  ch.on('change', async (filepath, stats) => {
    const { domain, file } = _getInfo(filepath)
    if (file.match('.*.scss$')) {
      _runBuilders(STYLE, domain, DATA_FOLDER)
    } else if (file.indexOf('_service') !== 0) {
      _runBuilders(META, domain, DATA_FOLDER)
    }
  })

  _checkCurrentState(DATA_FOLDER)
}


function _runBuilders (builders, webfolder, DATA_FOLDER) {
  _.map(builders, async (callBack, sysfile) => {
    const filepath = path.join(DATA_FOLDER, webfolder, sysfile)
    const content = await callBack(path.join(DATA_FOLDER, webfolder))
    return fs.promises.writeFile(filepath, content)
  })
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