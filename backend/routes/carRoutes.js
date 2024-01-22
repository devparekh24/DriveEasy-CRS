const express = require('express')
const router = express.Router()
const carController = require('../controller/carController')
const authController = require('./../controller/authController')

router.use(authController.protectedRoute)

router
    .route('/')
    .get(carController.getAllCars)
    .post(authController.restrictTo('admin'), carController.createCar)

router
    .route('/:id')
    .get(carController.getCar)
    .patch(authController.restrictTo('admin'), carController.updateCar)
    .delete(authController.restrictTo('admin'), carController.deleteCar)

module.exports = router