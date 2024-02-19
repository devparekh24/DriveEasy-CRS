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
        type: String
    },
    emailAddress: {
        type: String,
    },
    phoneNo: {
        type: String,
    },
    pickupAddress: {
        type: String,
    },
    pickupDate: {
        type: String,
    },
    pickupTime: {
        type: String,
    },
    dropOffAddress: {
        type: String,
    },
    dropOffDate: {
        type: String,
    },
    dropOffTime: {
        type: String,
    },
    totalKm: {
        type: Number,
    },
    totalAmount: {
        type: Number,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;