import bodyParser from 'body-parser'
import path from 'path'
import { listPages } from './files.js'
import buildStyle from './sass_render.js'

const JSONBodyParser = bodyParser.json()
const DATA_FOLDER = path.resolve(process.env.DATA_FOLDER || './data')

export default (ctx) => {
  const { express, auth, app } = ctx

  app.get('/:webid/routes.json', (req, res, next) => {
    const filePath = path.join(DATA_FOLDER, req.params.webid)
    listPages(filePath).then(r => res.json(r)).catch(next)
  })

  app.get('/:webid/style.css', (req, res, next) => {
    buildStyle(req.params.webid, DATA_FOLDER).then(css => {
      res.set('Content-Type', 'text/css')
      res.send(css)
    }).catch(next)
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