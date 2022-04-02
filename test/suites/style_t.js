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

  return describe('style', () => {

    it('must return style', async () => {
      const res = await r.get('/stredni.web.otevrenamesta.cz.css')
      res.status.should.equal(200)
    })

  })
}
