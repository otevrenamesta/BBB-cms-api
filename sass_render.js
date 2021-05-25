import fs from 'fs'
import path from 'path'
import sass from 'sass'
const NODE_MODULES = path.join(__dirname, './node_modules/')

export default async function buildStyle (webid, dataFolder) {
  const styleMain = path.join(dataFolder, webid, '_service', 'style', 'custom.scss')  
  const includePaths = [ NODE_MODULES ]
  const f = sass.renderSync({ file: styleMain, includePaths })
  return f.css
    // fs.writeFile(outFile, f.css, (err) => {
    //   return err ? console.error(err) : bs.reload(outFile)
    // })
}