const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    carName: {
        type: String,
        required: [true, 'Car must has a name']
    },
    transmission: {
        type: String,
        enum: ['Automatic', 'Manual', 'AM', 'CV']
    },
    companyName: {
        type: String,
        required: [true, 'Car must has a maker name']
    },
    carNumberPlate: {
        type: String,
        required: [true, 'Car must has a Number Plate'],
        unique: true,
        validate: {
            validator: function (value) {
                //regular expression for car number plate validation
                const regex = /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/;
                return regex.test(value);
            },
            message: 'Invalid car number plate format, Please follow this eg. MP 09 AB 1234'
        }
    },
    year: {
        type: String,
        required: [true, 'Car must has a manufacturing year']
    },
    mileage: {
        type: Number
    },
    capacity: {
        type: Number,
        required: [true, 'Car must has seatting capacity']
    },
    color: {
        type: String,
    },
    availability: {
        type: Boolean,
        default: true
    },
    rentPricePerDay: {
        type: Number,
        required: [true, 'Car must has rental price per day']
    },
    rentPricePerHour: {
        type: Number,
        required: [true, 'Car must has rental price per hour']
    },
    rentPricePerKm: {
        type: Number,
        required: [true, 'Car must has rental price per km']
    },
    image: {
        type: String,
        // required: [true, 'Car must has an image']
    },
    fule: {
        type: String,
        enum: ['Petrol', 'Diesel', 'EV', 'CNG'],
        default: 'Petrol'
    },
    whenWillCarAvailable: {
        type: String,
        required: [true, 'You have to mention that when will car available']
    },
    bookedDates: [
        {
            startDate: {
                type: Date,
                required: true,
            },
            endDate: {
                type: Date,
                required: true,
            },
        },
    ],
    hasBooking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }
}, {
    timestamps: true
})

const Car = mongoose.model('Car', carSchema)
module.exports = Car