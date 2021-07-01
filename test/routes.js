/* global describe it */
const chai = require('chai')
chai.should()
// import _ from 'underscore'

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  return describe('routes', () => {

    it('shall return componentlist', async () => {
      g.mockUser.groups = ['webmaster']
      const res = await r.get('/componentlist').set('Authorization', 'Bearer f')
      res.status.should.equal(200)
    })

    it('shall return layoutlist', async () => {
      const res = await r.get('/layoutlist').set('Authorization', 'Bearer f')
      res.status.should.equal(200)
      console.log(res.body)
    })

    it('shall create new page', async () => {
      const res = await r.post('/').send({ path: 'new/created.yaml' })
        .set('Authorization', 'Bearer f')
      res.status.should.equal(200)
      console.log(res.body)
    })

  })
}
