/* global describe it */
import fs from 'fs'
import path from 'path'
const chai = require('chai')
chai.should()
const webdav = require('webdav')

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  return describe('webdav', () => {

    it('shall get webdav listing', async () => {
      // const res = await r.get('/_posts/config.json')
      // res.status.should.equal(200)
      // res.body.attrs.should.have.lengthOf(4)
      // res.body.attrs[0].name.should.equal('title')

      const url = `http://localhost:${process.env.WEBDAV_PORT}`
      const client = webdav.createClient(url, {
        authType: webdav.AuthType.Digest,
        username: 'gandalf',
        password: 'shire'
      })
      try {
        const dirList = await client.getDirectoryContents('/testdomain.cz')
        console.log(dirList)
      } catch (e) {
        throw e
      }      
    })

  })
}
