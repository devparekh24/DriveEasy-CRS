const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');

const contactQuerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must has a name'],
    },
    email: {
        type: String,
        validate: [isEmail, 'Please enter valid email!'],
    },
    contactNo: {
        type: String,
        required: [true, 'User must have a contact number'],
        validate: {
            validator: function (value) {
                return /^[6-9]\d{9}$/.test(value);
            },
            message: 'Contact number must be a valid 10-digit mobile number'
        },
        unique: true,
    },
    message: {
        type: String,
        required: [true, 'Message can not empty'],
    },
    meeting: {
        type: String,
        enum: ['pending', 'Done'],
        default: 'pending'
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});

const ContactQuery = mongoose.model('ContactQuery', contactQuerySchema);

module.exports = ContactQuery;