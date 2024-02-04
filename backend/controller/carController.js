const mainController = require('./mainController')
const catchAsyncErr = require('./../utils/catchAsyncErr')
const AppError = require('../utils/appError')
const Car = require('../model/carModel')
const cloudinary = require('../utils/imgUpload')

exports.getAllCars = mainController.getAll(Car)
exports.getCar = mainController.getOne(Car)
exports.createCar = mainController.createOne(Car)
exports.updateCar = mainController.updateOne(Car)
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

    const updateCarImg = await Car.findByIdAndUpdate(id, { image: carImg.url })
    if (!updateCarImg) {
        return next(new AppError('No Car Found!', 404))
    }

    res.status(200).json({
        status: 'success',
        message: 'Image Uploaded Successfully!'
    })
})