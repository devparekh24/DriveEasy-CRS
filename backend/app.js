const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const errorController = require('./controller/errorController')
const authRouter = require('./routes/authRoutes')
const carRouter = require('./routes/carRoutes')
const userRouter = require('./routes/userRoutes')

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())
app.use('/', authRouter)
app.use('/users', userRouter)
app.use('/cars', carRouter)

app.use(errorController)

module.exports = app