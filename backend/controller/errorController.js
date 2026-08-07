const AppError = require("../utils/appError")

const handleDBError = (err) => {
    const msg = `Invalid ${err.path} : ${err.value}`
    return new AppError(msg, 400)
}

const handleDBDuplicate = (err) => {
    const key = Object.keys(err.keyValue || {})[0]
    const value = err.keyValue ? err.keyValue[key] : ''
    const fieldName = key === 'contactNumber' ? 'Phone number' : key === 'email' ? 'Email' : key || 'Field'
    const msg = `${fieldName} '${value}' already exists. Please use another ${fieldName.toLowerCase()}!`
    const appErr = new AppError(msg, 400)
    appErr.code = 11000
    return appErr
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors || {}).map(el => el.message)
    const message = `Invalid input data: ${errors.join('. ')}`
    return new AppError(message, 400)
}

const handleJWTError = () => {
    return new AppError('Invalid token, Please login again!', 401)
}

const handleTokenExpiredError = () => {
    return new AppError('Your token has expired!, Please login again!', 401)
}

const devError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

const prodError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.error('ERROR 💥', err)
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong on server side'
        })
    }
}

module.exports = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof AppError)) {
        if (error.name === 'CastError') error = handleDBError(error)
        if (error.code === 11000) error = handleDBDuplicate(error)
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
        if (error.name === 'JsonWebTokenError') error = handleJWTError()
        if (error.name === 'TokenExpiredError') error = handleTokenExpiredError()
    }

    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        devError(error, res)
    } else {
        prodError(error, res)
    }
}