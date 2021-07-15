import fs from 'fs'
import path from 'path'
import sass from 'sass'
const NODE_MODULES = path.join(__dirname, './node_modules/')

export default async function buildStyle (filePath) {
  const styleMain = path.join(filePath, '_service', 'style', 'custom.scss')  
  const includePaths = [ NODE_MODULES ]
  try {
    const f = sass.renderSync({ file: styleMain, includePaths })
    return f.css
  } catch (err) {
    return err.toString()
  }
    // fs.writeFile(outFile, f.css, (err) => {
    //   return err ? console.error(err) : bs.reload(outFile)
    // })
}