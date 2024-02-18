const express = require('express')
const router = express.Router({ mergeParams: true })
const carController = require('../controller/carController')
const authController = require('./../controller/authController')
const multer = require('multer')
const storage = multer.diskStorage({})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    }
    else {
        cb('invalid image file', false)
    }
};

const uploads = multer({ storage, fileFilter })

// router.use(authController.protectedRoute)

router.put('/:id/img-upload', authController.protectedRoute, authController.restrictTo('admin'), uploads.single('image'), carController.uploadImage)

router
    .route('/')
    .get(carController.getAllCars)
    .post(authController.protectedRoute,authController.restrictTo('admin'), carController.createCar)

router
    .route('/:id')
    .get(carController.getCar)
    .patch(authController.protectedRoute,authController.restrictTo('admin'), carController.updateCar)
    .delete(authController.protectedRoute,authController.restrictTo('admin'), carController.deleteCar)

module.exports = router