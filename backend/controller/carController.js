const mainController = require('./mainController')
const catchAsyncErr = require('./../utils/catchAsyncErr')
const AppError = require('../utils/appError')
const Car = require('../model/carModel')
const cloudinary = require('../utils/imgUpload')

exports.getAllCars = mainController.getAll(Car)
exports.getCar = mainController.getOne(Car)
exports.createCar = mainController.createOne(Car)
// exports.updateCar = mainController.updateOne(Car)
exports.deleteCar = mainController.deleteOne(Car)

exports.uploadImage = catchAsyncErr(async (req, res, next) => {

    const { id } = req.params;
    const car = await Car.findById(id);
    if (!car) {
        return next(new AppError('No Car Found!', 404));
    }

    const carImg = await cloudinary.uploader.upload(req.file.path, {
        // width: 500,
        height: 300,
        // crop: 'fill'
    })

    const updateCarImg = await Car.findByIdAndUpdate(id, { $set: { image: carImg.url } }, { new: true })
    if (!updateCarImg) {
        return next(new AppError('No Car Found!', 404))
    }

    res.status(200).json({
        status: 'success',
        message: 'Image Uploaded Successfully!'
    })
})

exports.updateCar = mainController.updateOne(Car, async (req) => {

    const { id } = req.params;
    const car = await Car.findByIdAndUpdate(id);

    if (!car) {
        return next(new AppError('No Car Found!', 404))
    }

    // Check if the car is available for the requested booking dates
    const { startDate, endDate } = req.body;
    if (car.isBookedFor(startDate, endDate)) {
        return next(new AppError('Car is already booked for the requested time period', 400))    
    } 
    
    // Add the booked dates to the car
    car.bookedDates.push({ startDate, endDate });
    await car.save()

    res.status(200).json({
        status: 'success',
        data: {
            data: car
        }
    })

});
