const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)

module.exports = router