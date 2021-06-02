/* global describe it */
import fs from 'fs'
import path from 'path'
const chai = require('chai')
chai.should()
const webdav = require('webdav')

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)
  const clients = {}

  return describe('webdav', () => {

    it('shall create webdav clients', async () => {
      const url = `http://localhost:${process.env.WEBDAV_PORT}/webdav/testdomain.cz`
      clients['testdomain.cz'] = webdav.createClient(url, {
        authType: webdav.AuthType.Digest,
        username: 'gandalf',
        password: 'mordor'
      })
      const url2 = `http://localhost:${process.env.WEBDAV_PORT}/webdav/testdomain2.cz`
      clients['testdomain2.cz'] = webdav.createClient(url2, {
        authType: webdav.AuthType.Digest,
        username: 'frodo',
        password: 'shire'
      })
    })

    it('shall get webdav listing', async () => {
      // res.status.should.equal(200)
      const dirList = await clients['testdomain.cz'].getDirectoryContents('/')
      dirList.should.have.lengthOf(2)
    })

    it('shall create dir', async () => {
      const r = await clients['testdomain.cz'].createDirectory('/pokus')
      console.log(r)
    })

    it('shall remove dir', async () => {
      const r = await clients['testdomain.cz'].deleteFile('/pokus')
      console.log(r)
    })

    it('must not perform any modify action on domain2 as gandalf', async () => {
      const url = `http://localhost:${process.env.WEBDAV_PORT}/webdav/testdomain2.cz`
      const client = webdav.createClient(url, {
        authType: webdav.AuthType.Digest,
        username: 'gandalf',
        password: 'mordor'
      })
      const dirList = await client.getDirectoryContents('/')
      dirList.should.have.lengthOf(1)
      const r = await client.putFileContents(dirList[0].filename, 'noo!!')
      const s = await client.stat(dirList[0].filename)
      s.size.should.not.equal('noo!!'.length)
    })

    it('shall get webdav listing of domain2', async () => {      
      const dirList = await clients['testdomain2.cz'].getDirectoryContents('/')
      dirList.should.have.lengthOf(1)
      dirList[0].filename.should.equal('/index.yaml')
    })

    it('shall read /index.yaml', async () => {
      const c = await clients['testdomain2.cz'].getFileContents('/index.yaml')
      const desiredContent = 'title: pokus2+ěščřžýáíé' //await fs.promises.readFile()
      c.toString().should.equal(desiredContent)
    })

  })
}
