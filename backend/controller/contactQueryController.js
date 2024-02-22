const mainController = require('./mainController')
const ContactQuery = require('../model/contactQueryModel')

exports.getAllContactQueries = mainController.getAll(ContactQuery)
exports.getContactQuery = mainController.getOne(ContactQuery)
exports.createContactQuery = mainController.createOne(ContactQuery)
exports.updateContactQuery = mainController.updateOne(ContactQuery)
exports.deleteContactQuery = mainController.deleteOne(ContactQuery)
