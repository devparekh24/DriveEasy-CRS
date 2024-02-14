const catchAsyncErr = require("../utils/catchAsyncErr");
const Razorpay = require('razorpay')

const razorpay = new Razorpay({
    key_id: process.env.RZP_ID,
    key_secret: process.env.RZP_SECRET,
})


exports.createBooking = catchAsyncErr(async (req, res, next) => {
    const { bookingFormData } = req.body; // Assuming find_car and bookingFormData are available in the request
    const { carId } = req.params; // Assuming find_car and bookingFormData are available in the request
    // console.log(find_car)
    console.log(carId)
    console.log(bookingFormData)
    // Create a Razorpay order

    const order = await razorpay.orders.create({
        amount: bookingFormData?.totalAmount * 100, // amount in paisa, multiply by 100 for rupees
        currency: 'INR', // change according to your currency
        receipt: 'order_receipt_' + Date.now(),
    });

    // const options = {
    //     key: RZP_ID, // replace with your Razorpay key id
    //     order_id: order.id, // Use the order ID obtained from the response
    //     handler: function (response) {
    //         alert('Payment Succeeded backend ', response);
    //         res.status(200).json({
    //             status: 'success',
    //             message: 'Payment succeeded',
    //             paymentResponse: response,
    //         });
    //     },
    //     prefill: {
    //         name: bookingFormData.fullName,
    //         email: bookingFormData.emailAddress,
    //         contact: bookingFormData.phoneNo,
    //     },
    //     theme: {
    //         color: '#000',
    //     },
    // };

    // const paymentObject = new Razorpay({
    //     key_id: process.env.RZP_ID,
    //     key_secret: process.env.RZP_SECRET,
    // }, options);

    // console.log(paymentObject)

    res.status(200).json({
        status: 'success',
        data: {
            bookingFormData
        }
    });
});

