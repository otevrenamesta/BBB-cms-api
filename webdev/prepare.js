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
  } catch (err) {
    const { stdout, stderr } = await exec(`ln -s ${to} ${from}`)
  }
  const vendorFile = path.join(to, '_service/vendor.js')
  concatVendorScripts(vendorFile)
}