import path from 'path'
import fs from 'fs'

export const DATA_FOLDER = function () {
  try {
    const FOLDER = path.resolve(process.env.WEBDATA_FOLDER)
    fs.statSync(FOLDER)
    return FOLDER
  } catch (_) {
    throw new Error(`WEBDATA_FOLDER ${process.env.WEBDATA_FOLDER} not exists!`)
  }
}()