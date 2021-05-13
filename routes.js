import path from 'path'
import files from './files.js'
import buildStyle from './sass_render.js'
import adminRoutes from './admin_routes.js'

const DATA_FOLDER = path.resolve(process.env.DATA_FOLDER || './data')

export default (ctx) => {
  const { express, app } = ctx

  app.get('/vendor.js', (req, res, next) => {
    const domain = process.env.DOMAIN || req.hostname
    files.concatVendorScripts(domain)
      .then(r => _sendContent(res, r, 'text/javascript')).catch(next)
  })

  app.get('/routes.json', (req, res, next) => {
    const domain = process.env.DOMAIN || req.hostname
    const filePath = path.join(DATA_FOLDER, domain)
    files.listPages(filePath).then(r => res.json(r)).catch(next)
  })

  app.get('/style.css', (req, res, next) => {
    const domain = process.env.DOMAIN || req.hostname
    buildStyle(domain, DATA_FOLDER)
      .then(css => _sendContent(res, css, 'text/css')).catch(next)
  })

  if (process.env.DOMAIN) {
    app.use('/data', express.static(path.join(DATA_FOLDER, process.env.DOMAIN)))

    app.get('*', (req, res, next) => {
      const domain = process.env.DOMAIN || req.hostname
      files.renderIndex(domain)
        .then(r => _sendContent(res, r, 'text/html')).catch(next)
    })
  }

  app.use('/api', adminRoutes(ctx, DATA_FOLDER))

  return app
}

function _sendContent (res, content, ctype) {
  res.set('Content-Type', ctype)
  res.send(content)
}
