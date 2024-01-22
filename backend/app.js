const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const authRouter = require('./routes/authRoutes')

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())
app.use('/', authRouter)

module.exports = app