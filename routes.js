import bodyParser from 'body-parser'
import path from 'path'
import files from './files.js'
import buildStyle from './sass_render.js'

const JSONBodyParser = bodyParser.json()
const DATA_FOLDER = path.resolve(process.env.DATA_FOLDER || './data')

export default (ctx) => {
  const { express, auth, app } = ctx

  app.get('/index.html', (req, res, next) => {
    const name = req.hostname
    files.renderIndex(name)
      .then(r => _sendContent(res, r, 'text/html')).catch(next)
  })

  app.get('/:webid/vendor.js', (req, res, next) => {
    files.concatVendorScripts()
      .then(r => _sendContent(res, r, 'text/javascript')).catch(next)
  })

  app.get('/:webid/routes.json', (req, res, next) => {
    const filePath = path.join(DATA_FOLDER, req.params.webid)
    files.listPages(filePath).then(r => res.json(r)).catch(next)
  })

  app.get('/:webid/style.css', (req, res, next) => {
    buildStyle(req.params.webid, DATA_FOLDER)
      .then(css => _sendContent(res, css, 'text/css')).catch(next)
  })

  process.env.SERVE_STATIC && app.use('/', express.static(DATA_FOLDER))

  // app.post('/:webid/',
  //   auth.requireMembership(ROLE.PROJECT_INSERTER),
  //   JSONBodyParser,
  //   (req, res, next) => {
  //     projekty.create(req.body, auth.getUID(req), knex)
  //       .then(created => { res.json(created[0]) })
  //       .catch(next)
  //   })

  app.put('/:webid/',
    // (req, res, next) => {
    //   projekty.canIUpdate(req.params.id, auth.getUID(req), knex).then(can => {
    //     return can ? next() : next(401)
    //   }).catch(next)
    // },
    JSONBodyParser,
    (req, res, next) => {
      files.update(req.params.webid, req.query.file, req.query.id, req.body, DATA_FOLDER)
        .then(updated => { res.json('ok') })
        .catch(next)
    })

  return app
}

function _sendContent (res, content, ctype) {
  res.set('Content-Type', ctype)
  res.send(content)
}
