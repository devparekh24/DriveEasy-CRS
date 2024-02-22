const express = require('express')
const router = express.Router({ mergeParams: true })
const orderController = require('../controller/orderController')
const authController = require('./../controller/authController')
const paymentController = require('./../controller/paymentController')

router.use(authController.protectedRoute)

router.route('/mybookings').get(orderController.getUserOrders);
router.route('/bookCar/:carId').post(paymentController.createBooking);

router
    .route('/')
    .get(authController.restrictTo('admin'), orderController.getAllOrders)
    .post(authController.restrictTo('user'), orderController.setUserId, orderController.createOrder)

router
    .route('/:id')
    .get(authController.restrictTo('admin'), orderController.getOrder)
    .patch(authController.restrictTo('admin'), orderController.updateOrder)
    .delete(authController.restrictTo('admin'),orderController.deleteOrder)

module.exports = router