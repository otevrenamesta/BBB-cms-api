import bodyParser from 'body-parser'
import files from './files.js'

const JSONBodyParser = bodyParser.json()

export default (ctx, DATA_FOLDER) => {
  const { express, auth } = ctx
  const app = express()

  app.get('/componentlist', auth.required, (req, res, next) => {
    const domain = process.env.DOMAIN || req.hostname
    files.fileList(domain, '_service/components', '*.js', DATA_FOLDER)
      .then(list => res.json(list))
      .catch(next)
  })

  app.get('/layoutlist', auth.required, (req, res, next) => {
    const domain = process.env.DOMAIN || req.hostname
    files.fileList(domain, '_service/layouts', '*.html', DATA_FOLDER)
      .then(list => res.json(list))
      .catch(next)
  })

  app.post('/',
    // auth.requireMembership(ROLE.PROJECT_INSERTER),
    auth.required,
    JSONBodyParser,
    (req, res, next) => {
      const domain = process.env.DOMAIN || req.hostname
      files.create(domain, req.body, auth.getUID(req), DATA_FOLDER)
        .then(created => { res.json({ content: created }) })
        .catch(next)
    })

  app.put('/',
    // (req, res, next) => {
    //   projekty.canIUpdate(req.params.id, auth.getUID(req), knex).then(can => {
    //     return can ? next() : next(401)
    //   }).catch(next)
    // },
    auth.required,
    JSONBodyParser,
    (req, res, next) => {
      const domain = process.env.DOMAIN || req.hostname
      files.update(domain, req.query.file, req.query.id, req.body, DATA_FOLDER)
        .then(updated => { res.json('ok') })
        .catch(next)
    })

  return app
}
