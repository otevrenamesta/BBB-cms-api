/* global describe it */
const chai = require('chai')
chai.should()
// import _ from 'underscore'

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)
  const u1 = {
    username: 'admin',
    password: 'secret'
  }

  return describe('routes', () => {

    it('shall return style', async () => {
      const res = await r.get('/style.css')
      res.status.should.equal(200)
    })

    it('shall return routes.json', async () => {
      const res = await r.get('/routes.json')
      res.status.should.equal(200)
      console.log(res.body)
    })

    it('shall return metainfo.json', async () => {
      const res = await r.get('/metainfo.json')
      res.status.should.equal(200)
      console.log(res.body)
    })

  })
}
