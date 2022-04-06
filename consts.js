import path from 'path'
import fs from 'fs'

export const FILESTORAGE_URL = process.env.FILESTORAGE_URL
if (!FILESTORAGE_URL) throw new Error('env.FILESTORAGE_URL not set')

export const TOKEN_URL = process.env.FILESTORAGE_ACCESS_TOKEN_URL
if (!TOKEN_URL) throw new Error('env.FILESTORAGE_ACCESS_TOKEN_URL not set')