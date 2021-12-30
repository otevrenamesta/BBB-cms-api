import files from './middleware.js'

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
    if (!isMember(req, conf.webmasterGroup)) {
      return next(new ErrorClass(403, 'you are not webmaster'))
    }
    next()
  }

  // app.get('/componentlist', session, required, 
  // (req, res, next) => {
  //   const domain = process.env.DOMAIN || req.hostname
  //   files.fileList(domain, '_service/components', '*.js', DATA_FOLDER)
  //     .then(list => res.json(list))
  //     .catch(next)
  // })

  // app.get('/layoutlist', session, required, 
  //   requireMembership(WEBMASTER), 
  //   (req, res, next) => {
  //     const domain = process.env.DOMAIN || req.hostname
  //     files.fileList(domain, '_service/layouts', '*.html', DATA_FOLDER)
  //       .then(list => res.json(list))
  //       .catch(next)
  //   })

  // app.put('/file',
  //   required, 
  //   requireMembership(WEBMASTER),
  //   JSONBodyParser, 
  //   (req, res, next) => {
  //     const domain = process.env.DOMAIN || req.hostname
  //     files.writeFile(domain, req.query.file, req.body, DATA_FOLDER)
  //       .then(updated => { res.json('ok') })
  //       .catch(next)
  //   })

  return app
}
