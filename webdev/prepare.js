import mkdirp from 'mkdirp'
import fs from 'fs'
import util from 'util'
import path from 'path'
import concatVendorScripts from '../vendor'
const exec = util.promisify(require('child_process').exec)

if (!process.env.WEB_REPO_PATH) {
  throw new Error('process.env.WEB_REPO_PATH must point to your webdata repo')
}

export default async function () {
  await mkdirp(process.env.DATA_FOLDER)
  const from = path.join(process.env.DATA_FOLDER, process.env.DOMAIN)
  const to = process.env.WEB_REPO_PATH
  try {
    fs.statSync(from)
    console.log(from, 'exists, removing ...')
    fs.unlinkSync(from)
    throw new Error()
  } catch (err) {
    console.log('linking ', from, '=>', to)
    const { _, stderr } = await exec(`ln -s ${to} ${from}`)
    if (stderr) throw new Error(stderr)
  }
  const vendorFile = path.join(to, '_service/vendor.js')
  concatVendorScripts(vendorFile)
}