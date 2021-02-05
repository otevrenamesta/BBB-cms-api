import bodyParser from 'body-parser'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import sass from 'sass'
import _ from 'underscore'
import BS from 'browser-sync'

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const WEB_FOLDER = process.env.WEB_FOLDER || './web'

const bs = BS.create()

bs.init({
  server: './web',
  port,
  host,
  open: false,
  ui: false,
  middleware: [
    morgan(process.env.NODE_ENV === 'production' ? 'short' : 'tiny'),
    bodyParser.json(),
    {
      route: '/api',
      handle: update
    }
  ]
})
bs.watch(WEB_FOLDER + '/index.html').on('change', bs.reload)

const outFile = WEB_FOLDER + '/style/style.css'
bs.watch(WEB_FOLDER + '/style/*.scss').on('change', (file) => {
  const includePaths = ['./node_modules/bootstrap/scss']
  try {
    const f = sass.renderSync({ file, includePaths, outFile })
    fs.writeFile(outFile, f.css, (err) => {
      return err ? console.error(err) : bs.reload(outFile)
    })
  } catch (err) {
    console.error(err)
  }
})

function update (req, res, next) {
  const pathParts = req.body.path.split('.')
  const filename = pathParts[0] === '/' ? '_index.js' : pathParts[0]
  const filePath = path.join(path.resolve(WEB_FOLDER), 'data', filename)
  try {
    const data = require(filePath).default
    const subTree = _.get(data, _.rest(pathParts))
    Object.assign(subTree, req.body.data)
    const src = `export default ${JSON.stringify(data, null, 2)}`
    fs.writeFile(filePath, src, (err) => {
      return err ? next(err) : res.write('ok') && res.end()
    })
  } catch (err) {
    next(err)
  }
}
