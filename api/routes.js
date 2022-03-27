import path from 'path'
import files from './middleware.js'
import renderStyle from './sass_render'
import { FILE_SERVICE_URL } from '../consts'

export default (ctx) => {
  const { express, auth, bodyParser, ErrorClass } = ctx
  const { session, isMember } = auth
  const app = express()

  app.post('/:domain', session, checkWebsiteConf, bodyParser, (req, res, next) => {
    files.create(req.params.domain, req.body, auth.getUID(req), ctx)
      .then(created => { res.json({ content: created }) })
      .catch(next)
  })

  app.put('/:domain', session, checkWebsiteConf, bodyParser, (req, res, next) => {
    files.update(req.params.domain, req.query.file, req.query.id, req.body, ctx)
      .then(updated => { res.json('ok') })
      .catch(next)
  })

  function checkWebsiteConf (req, res, next) {
    const conf = req.tenantcfg.websites.find(i => i.domain === req.params.domain)
    if (!conf) return next(new ErrorClass(404, 'unknown website'))
    if (!isMember(req, conf.webmastersGroup)) {
      return next(new ErrorClass(403, 'you are not webmaster'))
    }
    next()
  }

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
