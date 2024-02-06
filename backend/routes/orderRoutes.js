const express = require('express')
const router = express.Router({ mergeParams: true })
const orderController = require('../controller/orderController')
const authController = require('./../controller/authController')

router.use(authController.protectedRoute)

router.route('/mybookings').get(authController.restrictTo('user'), orderController.getUserOrders);

router
    .route('/')
    .get(authController.restrictTo('admin'), orderController.getAllOrders)
    .post(authController.restrictTo('user'), orderController.setUserId, orderController.createOrder)

router
    .route('/:id')
    .get(authController.restrictTo('admin'), orderController.getOrder)
    .patch(authController.restrictTo('admin'), orderController.updateOrder)
    .delete(orderController.deleteOrder)

module.exports = router