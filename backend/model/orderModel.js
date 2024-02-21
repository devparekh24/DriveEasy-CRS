const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    pickupAddress: {
        type: String,
        required: true
    },
    pickupDateAndTime: {
        type: Date,
        required: true
    },
    // pickupTime: {
    //     type: String,
    //     // required: true
    // },
    dropOffAddress: {
        type: String,
        required: true
    },
    dropOffDateAndTime: {
        type: Date,
        // required: true
    },
    // dropOffTime: {
    //     type: String,
    //     // required: true
    // },
    totalKm: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;