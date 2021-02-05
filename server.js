import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import sass from 'sass'
import _ from 'underscore'
import BS from 'browser-sync'

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const DATA_FOLDER = process.env.DATA_FOLDER || './web/data'

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
      route: "/api",
      handle: update
    }
  ]
})
bs.watch("./web/index.html").on("change", bs.reload)

// bs.watch("./web/data/*.js", function (event, file) {
//     if (event === "change") {
//         bs.reload("./web/data/*.js");
//     }
// })

const outFile = './web/style/style.css'
bs.watch('./web/style/*.scss').on('change', (file) => {
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

const JSONBodyParser = bodyParser.json()

const app = express()
app.use(morgan(process.env.NODE_ENV === 'production' ? 'short' : 'tiny'))

// app.get('/config', (req, res, next) => {
//   fs.readdir('config/', (err, files) => {
//     return err ? next(err) : res.json(_.map(files, i => ({ name: i })))
//   })
// })
// app.get('/config/:path', (req, res, next) => {
//   fs.readFile(`config/${req.params.path}`, 'utf8', (err, content) => {
//     return err ? next(err) : res.json(content)
//   })
// })

// app.get('/data/:path', (req, res, next) => {
//   fs.readFile(`data/${req.params.path}`, 'utf8', (err, content) => {
//     return err ? next(err) : res.json(content)
//   })
// })
// app.get('/site.js', (req, res, next) => {
//   fs.readFile('data/_site.yaml', 'utf8', (err, content) => {
//     const json = JSON.stringify(yaml.load(content), null, 2)
//     const js = `var MySiteSettings = ${json}`
//     return err ? next(err) : res.send(js)
//   })
// })
function update (req, res, next) {
  const pathParts = req.body.path.split('.')
  const filename = pathParts[0] === '/' ? 'index.js' : pathParts[0]
  const filePath = path.join(path.resolve(DATA_FOLDER), filename)
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
app.put('/data', JSONBodyParser, update)

app.use((err, eq, res, next) => {
  res.send(err)
})

// app.listen(port, host, (err) => {
//   if (err) throw err
//   console.log(`frodo do magic on ${host}:${port}`)
// })
