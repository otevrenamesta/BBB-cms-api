/* global describe it */
const chai = require('chai')
chai.should()
import _ from 'underscore'

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)
  const data = chai.request(g.dataurl)
  function wait (msecs) {
    return new Promise(resolve => setTimeout(resolve, msecs))
  }

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
      await wait(1500)
      const res2 = await data.get('/_service/routes.json')
      const found = _.find(res2.body, i => i.data === 'new/created.yaml')
      found.data.should.equal('new/created.yaml')
    })

    it('shall create new style', async () => {
      const orig = await data.get('/_service/style/custom.scss')
      const newContent = `
        ${orig.text}
        @import "pokus";
      `
      const res = await r.put('/file?file=_service/style/pokus.scss')
          .send({ content: '.ahoj { width: 1331px; }' })
          .set('Authorization', 'Bearer f')
      res.status.should.equal(200)
      const resMain = await r.put('/file?file=_service/style/custom.scss')
          .send({ content: newContent })
          .set('Authorization', 'Bearer f')
      resMain.status.should.equal(200)
      await wait(1500)
      const res2 = await data.get('/_service/style.css')
      res2.text.indexOf('width: 1331px;').should.be.above(0)
      // revert
      const resRevert = await r.put('/file?file=_service/style/custom.scss')
          .send({ content: orig.text })
          .set('Authorization', 'Bearer f')
      resRevert.status.should.equal(200)
    })

    // it('shal update page', async () => {
    //   const res = await data.get('/_service/metainfo.json')
    //   const found
    // })

  })
}
