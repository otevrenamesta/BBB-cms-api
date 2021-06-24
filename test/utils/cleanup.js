import fs from 'fs'
import path from 'path'

const toBeCleaned = [
  'testdomain.cz/_service/metainfo.json',
  'testdomain.cz/_service/routes.json',
  'testdomain.cz/_service/style.css',
  'testdomain2.cz/_service/metainfo.json',
  'testdomain2.cz/_service/routes.json'
]

export default function (DATA_FOLDER) {
  toBeCleaned.map(i => {
    const p = path.join(DATA_FOLDER, i)
    fs.promises.unlink(p)
  })
}