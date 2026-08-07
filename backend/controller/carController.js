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
        height: 300,
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

exports.updateCar = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const car = await Car.findById(id);

    if (!car) {
        return next(new AppError('No Car Found!', 404));
    }

    const { startDate, endDate, bookedDates, ...otherUpdates } = req.body;

    if (startDate && endDate) {
        if (car.isBookedFor(startDate, endDate)) {
            return next(new AppError('Car is already booked for the requested time period', 400));
        }
        car.bookedDates.push({ startDate, endDate });
    } else if (bookedDates && Array.isArray(bookedDates)) {
        car.bookedDates = bookedDates;
    }

    Object.assign(car, otherUpdates);
    await car.save();

    res.status(200).json({
        status: 'success',
        data: {
            data: car
        }
    });
});

exports.getCarsWithAvailability = catchAsyncErr(async (req, res, next) => {
    const { pickupDate, dropOffDate } = req.query;

    const cars = await Car.find({ availability: true });

    if (!pickupDate || !dropOffDate) {
        return res.status(200).json({
            status: 'success',
            data: { data: cars }
        });
    }

    const requestedStart = new Date(pickupDate);
    const requestedEnd = new Date(dropOffDate);

    const carsWithAvailability = cars.map(car => {
        const carObj = car.toObject();
        const conflictingBookings = (carObj.bookedDates || []).filter(booking => {
            const bookingStart = new Date(booking.startDate);
            const bookingEnd = new Date(booking.endDate);
            return bookingStart < requestedEnd && bookingEnd > requestedStart;
        });

        return {
            ...carObj,
            isBookedForPeriod: conflictingBookings.length > 0,
            conflictingBookings,
        };
    });

    // Sort: available cars first, then booked ones
    carsWithAvailability.sort((a, b) => Number(a.isBookedForPeriod) - Number(b.isBookedForPeriod));

    res.status(200).json({
        status: 'success',
        data: { data: carsWithAvailability }
    });
});

exports.getAvailableCars = catchAsyncErr( async (req, res, next) => {

    const { pickupDate, dropOffDate } = req.body;

    // Convert input dates to Date objects
    const pickupDateObj = new Date(pickupDate);
    const dropOffDateObj = new Date(dropOffDate);

    // Calculate the number of days between pickup and drop-off dates (inclusive)
    const totalDays = Math.floor((dropOffDateObj - pickupDateObj) / (1000 * 60 * 60 * 24)) + 1;

    // Find cars that have at least one available day within the given date range
    const availableCars = await Car.find({
      $or: [
        {
          bookedDates: {
            $not: {
              $elemMatch: {
                startDate: {
                  $lte: pickupDateObj,
                },
                endDate: {
                  $gte: dropOffDateObj,
                },
              },
            },
          },
        },
        {
          bookedDates: {
            $not: {
              $elemMatch: {
                startDate: {
                  $gte: pickupDateObj,
                  $lt: dropOffDateObj,
                },
              },
            },
          },
        },
        {
          bookedDates: {
            $not: {
              $elemMatch: {
                endDate: {
                  $gte: pickupDateObj,
                  $lt: dropOffDateObj,
                },
              },
            },
          },
        },
      ],
    }).limit(totalDays);

    res.status(200).json({
      status: 'success',
        data: {
            data : availableCars,
        },
    });
})

