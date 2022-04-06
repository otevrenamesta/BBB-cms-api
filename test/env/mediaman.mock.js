import express from 'express'

const app = express()
app.get('', (req, res) => {
  res.json({
    token: 'eyJhbGciOiJIUzI1Ni',
    path: '/omstredni'
  })
})

export default app
