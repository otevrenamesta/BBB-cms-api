import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import fs from 'fs'
import _ from 'underscore'

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const JSONBodyParser = bodyParser.json()

const app = express()
app.use(morgan(process.env.NODE_ENV === 'production' ? 'short' : 'tiny'))

app.get('/config', (req, res, next) => {
  fs.readdir('config/', (err, files) => {
    return err ? next(err) : res.json(_.map(files, i => ({ name: i })))
  })
})
app.get('/config/:path', (req, res, next) => {
  fs.readFile(`config/${req.params.path}`, 'utf8', (err, content) => {
    return err ? next(err) : res.json(content)
  })
})

app.get('/data/:path', (req, res, next) => {
  fs.readFile(`data/${req.params.path}`, 'utf8', (err, content) => {
    return err ? next(err) : res.json(content)
  })
})
app.put('/data/:path', JSONBodyParser, (req, res, next) => {
  fs.writeFile(`data/${req.params.path}`, req.body.data, (err) => {
    return err ? next(err) : res.json('ok')
  })
})

app.use((req, res, next, err) => {
  res.send(err)
})

app.listen(port, host, (err) => {
  if (err) throw err
  console.log(`frodo do magic on ${host}:${port}`)
})
