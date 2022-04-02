import _ from 'underscore'
import yaml from 'yaml'
const chai = require('chai')
chai.should()

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)
  function wait (msecs) {
    return new Promise(resolve => setTimeout(resolve, msecs))
  }

  return describe('files', () => {

    it('shall get new page content', async () => {
      const res = await r.get('/newpage').set('Authorization', 'Bearer f')
      res.status.should.equal(200)
    })

    it('shal get updated page content', async () => {
      const f = 'https://files.vxk.cz/omstredni/_webdata/stredni.web.otevrenamesta.cz/index.yaml'
      const change = {
        pokus: 'hokus'
      }
      const res = await r.get(`/changedpage?file=${f}&id=children.0`).send(change)
      res.status.should.equal(200)
      const result = yaml.parse(res.body.content)
      const subTree = _.get(result, ['children', 0, 'pokus'])
      subTree.should.equal(change.pokus)
    })

  })
}
