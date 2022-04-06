import path from 'path'
import files from './middleware.js'
import renderStyle from './sass_render'
import { FILE_SERVICE_URL } from '../consts'

export default (ctx) => {
  const { express, auth, bodyParser, ErrorClass } = ctx
  const app = express()

  app.get('/:domain/newpage', auth.session, checkWebsiteConf, async (req, res, next) => {
    try {
      const u = await files.uploadInfo(req.params.domain, req.user, req.tenantid)
      const content = await files.create(auth.getUID(req))
      res.json(Object.assign(u, { content }))
    } catch (err) {
      next(err)
    }
  })

  app.put('/:domain/changedpage', auth.session, checkWebsiteConf, bodyParser, async (req, res, next) => {
    try {
      const u = await files.uploadInfo(req.params.domain, req.user, req.tenantid)
      const content = await files.update(req.query.file, req.query.id, req.body, ErrorClass)
      res.json(Object.assign(u, { content }))
    } catch (err) {
      next(err)
    }
  })

  app.get('/(:domain).css', (req, res, next) => {
    const url = path.join(req.tenantid, '_webdata', req.params.domain)
    renderStyle(FILE_SERVICE_URL + url).then(resultBuff => {
      res.set('Content-Type', 'text/css')
      res.write(resultBuff)
      res.end()
    }).catch(next)
  })

  function checkWebsiteConf (req, res, next) {
    const conf = req.tenantcfg.websites.find(i => i.domain === req.params.domain)
    if (!conf) return next(new ErrorClass(404, 'unknown website'))
    if (!auth.isMember(req, conf.webmastersGroup)) {
      return next(new ErrorClass(403, 'you are not webmaster'))
    }
    next()
  }

  return app
}
