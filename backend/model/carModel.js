const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    carName: {
        type: String,
        required: [true, 'Car must has a name']
    },
    transmission: {
        type: String,
        enum: ['Automatic', 'Manual', 'Automated Manual', 'Continuously Variable']
    },
    companyName: {
        type: String,
        required: [true, 'Car must has a maker name']
    },
    carNumberPlate: {
        type: String,
        required: [true, 'Car must has a Number Plate'],
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
    }
}, {
    timestamps: true
})

const Car = mongoose.model('Car', carSchema)
module.exports = Car