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

router.use(authController.protectedRoute)

router.post('/:id/img-upload', authController.restrictTo('admin'), uploads.single('image'), carController.uploadImage)

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