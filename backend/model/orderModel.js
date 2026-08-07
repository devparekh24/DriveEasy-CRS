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
        required: true,
        validate: {
            validator: function (val) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
            },
            message: 'Please enter a valid email address'
        }
    },
    phoneNo: {
        type: String,
        required: true,
        validate: {
            validator: function (val) {
                return /^[6-9]\d{9}$/.test(val);
            },
            message: 'Phone number must be a valid 10-digit mobile number'
        }
    },
    pickupAddress: {
        type: String,
        required: true
    },
    pickupDateAndTime: {
        type: Date,
        required: true
    },
    dropOffAddress: {
        type: String,
        required: true
    },
    dropOffDateAndTime: {
        type: Date,
        // required: true
    },

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