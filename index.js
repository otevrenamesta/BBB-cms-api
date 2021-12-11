import initApi from './api/routes'
import startFileWatcher from './watcher'

export async function migrateDB () {
  startFileWatcher()
}

export const init = initApi