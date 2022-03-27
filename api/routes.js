import path from 'path'
import files from './middleware.js'
import renderStyle from './sass_render'
import { FILE_SERVICE_URL } from '../consts'

export default (ctx) => {
  const { express, auth, bodyParser, ErrorClass } = ctx
  const app = express()

  app.get('/newpage', auth.session, auth.required, (req, res, next) => {
    files.create(auth.getUID(req))
      .then(created => { res.json({ content: created }) })
      .catch(next)
  })

  app.get('/changedpage', bodyParser, (req, res, next) => {
    files.update(req.query.file, req.query.id, req.body, ErrorClass)
      .then(updated => { res.json({ content: updated }) })
      .catch(next)
  })

  app.get('/(:domain).css', (req, res, next) => {
    const url = path.join(req.tenantid, '_webdata', req.params.domain)
    renderStyle(FILE_SERVICE_URL + url).then(resultBuff => {
      res.set('Content-Type', 'text/css')
      res.write(resultBuff)
      res.end()
    }).catch(next)
  })

  return app
}
