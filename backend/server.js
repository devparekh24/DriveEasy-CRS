const mongoose = require('mongoose');
const app = require('./app')
const dotenv = require('dotenv')
dotenv.config()

const db = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(db).then(() => console.log('DataBase Connected Successfully...'));

const port = process.env.PORT || 8000;
const env = process.env.NODE_ENV || 'production';


app.listen(port, () => console.log(`Connection established with the sever on port : ${port} in ${env} mode`))