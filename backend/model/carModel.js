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
    // model: {
    //     type: String,
    //     required: [true, 'Car must has a model name']
    // },
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
    rentPrice: {
        type: Number,
        required: [true, 'Car must has rental price']
    },
    image: {
        type: String,
        // required: [true, 'Car must has an image']
    },
    fule: {
        type: String,
        enum: ['Petrol', 'Diesel', 'EV', 'CNG'],
        default: 'Petrol'
    }
}, {
    timestamps: true
})

const Car = mongoose.model('Car', carSchema)
module.exports = Car