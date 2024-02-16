const mainController = require('./mainController')
const DamageReport = require('../model/damageReportModel')

exports.getAllDamageReports = mainController.getAll(DamageReport)
exports.getDamageReport = mainController.getOne(DamageReport)
exports.createDamageReport = mainController.createOne(DamageReport)
exports.updateDamageReport = mainController.updateOne(DamageReport)
exports.deleteDamageReport = mainController.deleteOne(DamageReport)
