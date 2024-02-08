const catchAsyncErr = require("../utils/catchAsyncErr");
// const rzp = require("../utils/payment");
const { RZP_ID } = process.env;
const Razorpay = require('razorpay')

const razorpay = new Razorpay({
    key_id: process.env.RZP_ID,
    key_secret: process.env.RZP_SECRET,
})


exports.createBooking = catchAsyncErr(async (req, res, next) => {
    const { find_car, bookingFormData } = req.body; // Assuming find_car and bookingFormData are available in the request
    const { carId } = req.params; // Assuming find_car and bookingFormData are available in the request
    console.log(find_car)
    // Create a Razorpay order
    const order = await razorpay.orders.create({
        amount: 1000, // amount in paisa, multiply by 100 for rupees
        currency: 'INR', // change according to your currency
        receipt: 'order_receipt_' + Date.now(),
    });

    // // Handle the response and proceed with the payment
    // const options = {
    //     key: RZP_ID, // replace with your Razorpay key id
    //     order_id: order.id, // Use the order ID obtained from the response
    //     handler: function (response) {
    //         // Handle successful payment
    //         console.log('Payment successful:', response);
    //     },
    //     prefill: {
    //         name: bookingFormData.fullName,
    //         email: bookingFormData.emailAddress,
    //         contact: bookingFormData.phoneNo,
    //     },
    //     theme: {
    //         color: '#F37254', // customize theme color
    //     },
    // };
    const options = {
        key: RZP_ID, // replace with your Razorpay key id
        // order_id: order.id, // Use the order ID obtained from the response
        amount: 1000 * 100,
        currency: 'INR',
        image: 'https://dummyimage.com/600x400/000/fff',
        handler: function (response) {
            alert('Payment Succeeded');
            // window.open("/", "_self");
        },
        // prefill: {
        //     name: bookingFormData.fullName,
        //     email: bookingFormData.emailAddress,
        //     contact: bookingFormData.phoneNo,
        // },
        theme: {
            color: '#2300a3',
        },
    };
    const paymentObject = new razorpay(options);
    paymentObject.open();

    // res.status(200).json({
    //     status: 'success',
    //     orderId: order.id, // You might want to send the order ID to the client for future reference
    // });
});

