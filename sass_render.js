import fs from 'fs'
import path from 'path'
import sass from 'sass'

export default async function buildStyle (webid, dataFolder) {
  const styleMain = path.join(dataFolder, webid, '_service', 'style', 'custom.scss')
  const includePaths = ['./node_modules/bootstrap/scss']
  const f = sass.renderSync({ file: styleMain, includePaths })
  return f.css
    // fs.writeFile(outFile, f.css, (err) => {
    //   return err ? console.error(err) : bs.reload(outFile)
    // })
}