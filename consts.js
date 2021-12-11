import path from 'path'
import fs from 'fs'

export const DATA_FOLDER = function () {
  try {
    const FOLDER = path.resolve(process.env.DATA_FOLDER)
    fs.statSync(FOLDER)
    return FOLDER
  } catch (_) {
    throw new Error(`DATA_FOLDER ${process.env.DATA_FOLDER} not exists!`)
  }
}()