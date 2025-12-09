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

// CORS configuration - Allow multiple origins
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'https://drive-easy-crs.vercel.app' // Add your Vercel URL here
].filter(Boolean); // Remove undefined values

console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, Postman, curl, server-to-server)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('❌ Blocked by CORS:', origin);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
}));

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/', authRouter)
app.use('/users', userRouter)
app.use('/cars', carRouter)
app.use('/orders', orderRouter)
app.use('/contact-queries', contactQueryRouter)
app.use('/damage-reports', damageReportRouter)

app.use(errorController)

module.exports = app