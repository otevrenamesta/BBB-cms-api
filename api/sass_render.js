import fs from 'fs'
import _ from 'underscore'
import axios from 'axios'
import path from 'path'
import sass from 'sass'
import temp from 'temp'
const NODE_MODULES = function () {
  try {
    const bulma = require('bulma')
  } catch (err) {
    if (err.message === 'Invalid or unexpected token') {
      return err.stack.split('\n')[0].split('/').slice(0,-2).join('/')
    }
  }
}()

async function saveFiles (url, destFolder) {
  const styleMain = url + '/' + path.join('style', 'custom.scss')
  const customList =  url + '/' + path.join('style', 'components')
  const compomentFolder = path.join(destFolder, 'components')
  let promises = []

  const reqs = await Promise.all([
    axios.get(styleMain),
    axios.get(customList)
  ])
  const mainFile = path.join(destFolder, 'custom.scss')
  promises.push(fs.promises.writeFile(mainFile, reqs[0].data, 'utf-8'))
  promises.push(fs.promises.mkdir(compomentFolder))
  const loadPromises = reqs[1].data
    .filter(i => i.type === 'file' && i.name.match(/.(scss|sass)$/))
    .map(i => {
      return axios.get(customList + '/' + i.name).then(res => {
        return fs.promises.writeFile(path.join(compomentFolder, i.name), res.data, 'utf-8')
      })
    })
  promises = promises.concat(loadPromises)
  await Promise.all(promises)
  return mainFile
}

// stahne vsechny style fily a lokalne zbuildi vysledny css
export default async function buildStyle (url) {
  const includePaths = [ NODE_MODULES ]
  const dir = await temp.mkdir('stylecreator')
  const styleMain = await saveFiles(url, dir)
  try {
    const f = sass.renderSync({ file: styleMain, includePaths })
    return f.css
  } finally {
    temp.cleanup()
  }
}