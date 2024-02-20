const mainController = require('./mainController')
const Order = require('../model/orderModel')
const catchAsyncErr = require('../utils/catchAsyncErr')
const Car = require('../model/carModel')

exports.getAllOrders = mainController.getAll(Order)
// exports.getAllOrders = mainController.getAll(Order, ['car', 'user']) for populate
exports.getOrder = mainController.getOne(Order)
// exports.createOrder = mainController.createOne(Order)
exports.updateOrder = mainController.updateOne(Order)
exports.deleteOrder = mainController.deleteOne(Order)

exports.createOrder = catchAsyncErr(async (req, res, next) => {

    const { carId, newOrder } = req.body;

    const car = await Car.findById(carId);

    // Check if the car is available for the requested booking dates
    const { pickupDate, dropOffDate } = newOrder;

    const isAvailable = car.bookedDates.every((booking) => {
        return (
            new Date(dropOffDate) < new Date(booking.startDate) && new Date(pickupDate) > new Date(booking.endDate)
        );
    });

    if (!isAvailable) {
        return next(new AppError('Car is not available for the selected dates', 400));
    }

    // Add the booked dates to the car
    car.bookedDates.push({ startDate: pickupDate, endDate: dropOffDate });
    await car.save();

    // Create the order
    const order = await Order.create(newOrder);


    res.status(201).json({
        status: 'success',
        data: {
            data: order,
        },
    });
})

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