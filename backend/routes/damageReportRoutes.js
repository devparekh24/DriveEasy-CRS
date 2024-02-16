const express = require('express')
const router = express.Router()
const damageReportController = require('../controller/damageReportController')
const authController = require('./../controller/authController')

router.use(authController.protectedRoute, authController.restrictTo('admin'))

router
    .route('/')
    .get(damageReportController.getAllDamageReports)
    .post(damageReportController.createDamageReport)

router
    .route('/:id')
    .get(damageReportController.getDamageReport)
    .patch(damageReportController.updateDamageReport)
    .delete(damageReportController.deleteDamageReport)

module.exports = router