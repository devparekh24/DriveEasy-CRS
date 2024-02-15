const express = require('express')
const router = express.Router()
const contactQueryController = require('../controller/contactQueryController')
const authController = require('./../controller/authController')

router
    .route('/')
    .get(authController.protectedRoute, authController.restrictTo('admin'), contactQueryController.getAllContactQueries)
    .post(contactQueryController.createContactQuery)

router.use(authController.protectedRoute)

router
    .route('/:id')
    .get(authController.restrictTo('admin'), contactQueryController.getContactQuery)
    .patch(authController.restrictTo('admin'), contactQueryController.updateContactQuery)
    .delete(authController.restrictTo('admin'), contactQueryController.deleteContactQuery)

module.exports = router