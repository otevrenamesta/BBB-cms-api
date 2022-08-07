import fs from 'fs'
import path from 'path'

const toBeCleaned = [
  'testdomain.cz/_service/metainfo.json',
  'testdomain.cz/_service/routes.json',
  'testdomain.cz/_service/style.css',
  'testdomain2.cz/_service/metainfo.json',
  'testdomain2.cz/_service/routes.json',
  'testdomain2.cz/_service/style.css',
  'testdomain.cz/new/created.yaml',
  'testdomain.cz/new',
  'testdomain.cz/_service/style/pokus.scss'
]

export default async function (FILE_SERVICE_URL) {
  return toBeCleaned.reduce((promise, i) => {
    const p = path.join(FILE_SERVICE_URL, i)
    return promise.then(fs.promises.unlink(p))
  }, Promise.resolve())
}