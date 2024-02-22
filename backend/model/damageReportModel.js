const mongoose = require('mongoose');

const damageReportSchema = new mongoose.Schema({
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
    location: {
        type: String,
        required: [true, 'Location is required for DamageReport'],
    },
    description: {
        type: String,
        required: [true, 'Description is required for DamageReport'],
    },
    isDamageRepaired: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});

const DamageReport = mongoose.model('DamageReport', damageReportSchema);

module.exports = DamageReport;