const mainController = require('./mainController')
const Order = require('../model/orderModel')
const catchAsyncErr = require('../utils/catchAsyncErr')

exports.getAllOrders = mainController.getAll(Order)
// exports.getAllOrders = mainController.getAll(Order, ['car', 'user']) for populate
exports.getOrder = mainController.getOne(Order)
exports.createOrder = mainController.createOne(Order)
exports.updateOrder = mainController.updateOne(Order)
exports.deleteOrder = mainController.deleteOne(Order)

exports.setUserId = (req, res, next) => {

    // allowed nested routes
    if (!req.body.user) req.body.user = req.params.userId
    if (!req.body.user) req.body.user = req.user.id
    next()
}

// Get orders to the specific user
exports.getUserOrders = catchAsyncErr(async (req, res, next) => {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId });

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders,
        },
    });
});