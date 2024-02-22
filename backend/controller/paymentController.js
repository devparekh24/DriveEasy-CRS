const catchAsyncErr = require("../utils/catchAsyncErr");
const Razorpay = require('razorpay')

const razorpay = new Razorpay({
    key_id: process.env.RZP_ID,
    key_secret: process.env.RZP_SECRET,
})


exports.createBooking = catchAsyncErr(async (req, res, next) => {
    const { bookingFormData } = req.body; 
    const { carId } = req.params; 

    // Create a Razorpay order
    const order = await razorpay.orders.create({
        amount: bookingFormData?.totalAmount * 100, // amount in paisa, multiply by 100 for rupees
        currency: 'INR', // your currency
        receipt: 'order_receipt_' + Date.now(),
    });

    res.status(200).json({
        status: 'success',
        data: {
            bookingFormData
        }
    });
});

