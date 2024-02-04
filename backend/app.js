const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const errorController = require('./controller/errorController')
const authRouter = require('./routes/authRoutes')
const carRouter = require('./routes/carRoutes')
const orderRouter = require('./routes/orderRoutes')
const userRouter = require('./routes/userRoutes')

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors())
app.use('/', authRouter)
app.use('/users', userRouter)
app.use('/cars', carRouter)
app.use('/orders', orderRouter)

app.use(errorController)

module.exports = app