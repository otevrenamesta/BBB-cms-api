import bodyParser from 'body-parser'
import path from 'path'
import { listPages, concatVendorScripts, renderIndex } from './files.js'
import buildStyle from './sass_render.js'

const JSONBodyParser = bodyParser.json()
const DATA_FOLDER = path.resolve(process.env.DATA_FOLDER || './data')

export default (ctx) => {
  const { express, auth, app } = ctx

  app.get('/index.html', (req, res, next) => {
    const name = req.hostname
    renderIndex(name).then(r => _sendContent(res, r, 'text/html')).catch(next)
  })
  app.get('/:webid/vendor.js', (req, res, next) => {
    concatVendorScripts()
      .then(r => _sendContent(res, r, 'text/javascript')).catch(next)
  })
  // TODO: servirovat browser-syncem na zabezpecene route pro potreby debug designu atd.

  app.get('/:webid/routes.json', (req, res, next) => {
    const filePath = path.join(DATA_FOLDER, req.params.webid)
    listPages(filePath).then(r => res.json(r)).catch(next)
  })

  app.get('/:webid/style.css', (req, res, next) => {
    buildStyle(req.params.webid, DATA_FOLDER)
      .then(css => _sendContent(res, css, 'text/css')).catch(next)
  })

  app.use('/', express.static(DATA_FOLDER))

  // app.post('/',
  //   auth.requireMembership(ROLE.PROJECT_INSERTER),
  //   JSONBodyParser,
  //   (req, res, next) => {
  //     projekty.create(req.body, auth.getUID(req), knex)
  //       .then(created => { res.json(created[0]) })
  //       .catch(next)
  //   })

  // app.put('/:webid/:id',
  //   (req, res, next) => { 
  //     projekty.canIUpdate(req.params.id, auth.getUID(req), knex).then(can => {
  //       return can ? next() : next(401)
  //     }).catch(next)
  //   },
  //   JSONBodyParser,
  //   (req, res, next) => {
  //     projekty.update(req.params.id, req.body, knex)
  //       .then(updated => { res.json(updated[0]) })
  //       .catch(next)
  //   })

  return app
}

function _sendContent(res, content, ctype) {
  res.set('Content-Type', ctype)
  res.send(content)
}