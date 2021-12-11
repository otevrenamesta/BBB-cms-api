/* global describe it */
const chai = require('chai')
chai.should()
// import _ from 'underscore'

module.exports = (g) => {
  //
  const r = chai.request(g.dataurl)

  return describe('systemFiles', () => {

    it('shall return style', async () => {
      const res = await r.get('/testdomain.cz/_service/style.css')
      res.status.should.equal(200)
    })

    it('shall return routes.json', async () => {
      const res = await r.get('/testdomain.cz/_service/routes.json')
      res.status.should.equal(200)
      res.body[0].data.should.equal('index.yaml')
    })

    it('shall return metainfo.json', async () => {
      const res = await r.get('/testdomain.cz/_service/metainfo.json')
      res.status.should.equal(200)
      res.body['index.yaml'].title.should.equal('pokus')
    })

  })
}
