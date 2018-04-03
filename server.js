const express = require('express')
const bodyParser = require('body-parser')
const { shopRoute, commentsRoute } = require('./routes')
const { PORT = 80 } = process.env

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
  res.header('Content-Type', 'application/json')
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/shop', shopRoute)
app.use('/comments', commentsRoute)

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})