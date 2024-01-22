const express = require('express')
const router = express.Router()
const orderController = require('../controller/orderController')
const authController = require('./../controller/authController')

router.use(authController.protectedRoute)

router
    .route('/')
    .get(authController.restrictTo('admin'), orderController.getAllOrders)
    .post(orderController.createOrder)

router
    .route('/:id')
    .get(authController.restrictTo('admin'), orderController.getOrder)
    .patch(authController.restrictTo('admin'), orderController.updateOrder)
    .delete(orderController.deleteOrder)

module.exports = router