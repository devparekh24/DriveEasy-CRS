const express = require('express')
const router = express.Router()
const userController = require('./../controller/userController')
const authController = require('./../controller/authController')
const orderRouter = require('./orderRoutes')
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

const uploads = multer({
    storage,
    fileFilter,
    limits: { fieldSize: 10000000 }
})

//nested route
router.use('/:userId/orders', orderRouter)

router.use(authController.protectedRoute)

router.patch('/updateMe', authController.updateMe)

router.get('/logout', authController.logout)

router.delete('/deleteMe', userController.deleteMe)

router.use(authController.protectedRoute)

router.patch('/:id', userController.changeUserRole)

router.put('/:id/user-img-upload', authController.restrictTo('admin'), uploads.single('image'), userController.uploadUserImage)

router
    .route('/')
    .get(userController.getAllUser)
    .post(userController.createUser)

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)


module.exports = router