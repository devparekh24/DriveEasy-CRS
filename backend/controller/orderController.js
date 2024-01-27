const mainController = require('./mainController')
const Order = require('../model/orderModel')

exports.getAllOrders = mainController.getAll(Order)
exports.getOrder = mainController.getOne(Order)
exports.createOrder = mainController.createOne(Order)
exports.updateOrder = mainController.updateOne(Order)
exports.deleteOrder = mainController.deleteOne(Order)