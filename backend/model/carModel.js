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
    },
    fule: {
        type: String,
        enum: ['Petrol', 'Diesel', 'EV', 'CNG'],
        default: 'Petrol'
    },
    whenWillCarAvailable: {
        type: String,
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
}, {
    timestamps: true
})

carSchema.methods.isBookedFor = function(startDate, endDate) {
    const bookedDates = this.bookedDates;
    for (let i = 0; i < bookedDates.length; i++) {
        const bookedStartDate = bookedDates[i].startDate;
        const bookedEndDate = bookedDates[i].endDate;
        if (
            (startDate >= bookedStartDate && startDate <= bookedEndDate) ||
            (endDate >= bookedStartDate && endDate <= bookedEndDate)
        ) {
            return true;
        }
    }
    return false;
}

const Car = mongoose.model('Car', carSchema)
module.exports = Car