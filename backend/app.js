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
const contactQueryRouter = require('./routes/contactQueryRoutes')
const damageReportRouter = require('./routes/damageReportRoutes')

// CORS configuration
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true,
// }));
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
// CORS configuration for production
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use('/', authRouter)
app.use('/users', userRouter)
app.use('/cars', carRouter)
app.use('/orders', orderRouter)
app.use('/contact-queries', contactQueryRouter)
app.use('/damage-reports', damageReportRouter)

app.use(errorController)

module.exports = app