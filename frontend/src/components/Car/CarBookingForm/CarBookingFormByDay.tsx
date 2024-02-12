import './CarBookingForm.css';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { setBookingData, BookingState, initialState } from "../../../slices/bookingSlice";
import { DatePicker } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useBookCarMutation } from '../../../services/bookingApi';
import useRazorpay from "react-razorpay";
import { addOrder } from '../../../slices/orderSlice';

dayjs.extend(customParseFormat);
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;

// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

const calculateTotalAmount = (basePrice: number, pickupDate: string, dropOffDate: string): number => {
  const pricePerDay = basePrice;
  // Parse input dates
  const pickupDateTime = Date.parse(pickupDate);
  const dropOffDateTime = Date.parse(dropOffDate);
  // Check if the date parsing was successful
  if (isNaN(pickupDateTime) || isNaN(dropOffDateTime)) {
    // console.error("Invalid date format");
    return 0; // Or handle the error in a way suitable for your application
  }
  const totalDays = Math.ceil(((dropOffDateTime - pickupDateTime) + 1) / (24 * 60 * 60 * 1000));

  if (totalDays <= 0) {
    // console.error("Invalid date range");
    return 0; // Or handle the error in a way suitable for your application
  }

  return pricePerDay * totalDays;
};

const CarBookingForm = () => {

  const params = useParams<{ id: string }>();
  const cars = useAppSelector(state => state.car.cars)
  // const pickupAdd = useAppSelector(state => state.address.pickupAddress)
  // const dropoffAdd = useAppSelector(state => state.address.dropoffAddress)
  const bookingFormData = useAppSelector(state => state.booking)

  const find_car = cars.find((c: any) => {
    return c._id == params.id;
  });

  const [Razorpay] = useRazorpay();
  // console.log('rzp', Razorpay)
  const dispatch = useAppDispatch()

  const [bookCar, { data: bookCarData, error: bookCarError, isLoading: bookCarLoading, isSuccess: bookCarSuccess }] = useBookCarMutation();

  const [formData, setFormData] = useState<BookingState>(initialState)



  const calculateAndSetTotalAmount = () => {
    const totalAmount = calculateTotalAmount(find_car!.rentPrice, formData.pickupDate, formData.dropOffDate);
    setFormData(prevData => ({ ...prevData, totalAmount }));
  };

  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);

    if (Array.isArray(dateString)) {
      const [pickupDate, dropOffDate] = dateString.map(item => item.split(' ')[0]);
      const [pickupTime, dropOffTime] = dateString.map(item => item.split(' ')[1]);

      setFormData(prevData => ({
        ...prevData,
        pickupDate,
        dropOffDate,
        pickupTime,
        dropOffTime,
      }));
      calculateAndSetTotalAmount();
    }
  };

  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    console.log('onOk: ', value!);
  };


  const handleSubmitBookingForm = async (event: any) => {

    event.preventDefault();


    dispatch(setBookingData(formData));
    setFormData(initialState)

    // Use the API mutation to book the car
    try {
      const response = await bookCar({ carId: find_car!._id, bookingData: bookingFormData })
      console.log('Booking successful:', response);
      // Handle the successful booking (e.g., show a success message, redirect, etc.)
      handlePayment(bookingFormData)

    } catch (error) {
      console.error('Error booking the car:', error);
      // Handle the error (e.g., show an error message)
    }

  };

  const handlePayment = async (bookingData: any) => {
    const order = await addOrder(bookingData); //  Create order on your backend
    console.log(order)

    const options = {
      key: "rzp_test_rj5Bthp9EwXcYE", // Enter the Key ID generated from the Dashboard
      amount: 500 * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
      handler: function (response: any) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        name: "Piyush Garg",
        email: "youremail@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new Razorpay(options);

    rzp1.on("payment.failed", function (response: any) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });

    rzp1.open();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
    if (name === "pickupDate" || name === "dropOffDate") {
      calculateAndSetTotalAmount();
    }
  }


  useEffect(() => {
    calculateAndSetTotalAmount();
  }, [find_car, formData.pickupDate, formData.dropOffDate])

  useEffect(() => {
    if (bookCarSuccess) {
      console.log(bookCarData)
      // setFormData(initialState)
    }
  }, [bookCarSuccess])


  return (
    <div>
      <form onSubmit={handleSubmitBookingForm}>
        <h2>
          ${find_car?.rentPrice} <span>Per Day</span>
        </h2>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            placeholder="Enter Full Name"
            name="fullName"
            id="fullName"
            onChange={handleChange}
            value={formData.fullName}
            required
          />
        </div>
        <div>
          <label htmlFor="emailAddress">Email Address</label>
          <input
            type="email"
            placeholder="Enter Email"
            name="emailAddress"
            id="emailAddress"
            onChange={handleChange}
            value={formData.emailAddress}
          />
        </div>
        <div>
          <label htmlFor="phoneNo">Phone Number</label>
          <input
            type="text"
            placeholder="Enter Contact Number"
            name="phoneNo"
            id="phoneNo"
            onChange={handleChange}
            value={formData.phoneNo}
            required
          />
        </div>
        <div className='range-picker'>
          <label htmlFor="pickupAddress">Select Date & Time</label>
          <RangePicker
            disabledDate={disabledDate}
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [dayjs('08:00', 'HH:mm'), dayjs('20:00', 'HH:mm')],
            }}
            format="YYYY-MM-DD HH:mm"
            onChange={onChange}
            onOk={onOk}
          />
        </div>
        <div>
          <label htmlFor="pickupAddress">Pickup Address</label>
          <input
            type="text"
            placeholder="Enter Pick-up Address"
            name="pickupAddress"
            id="pickupAddress"
            onChange={handleChange}
            value={formData.pickupAddress}
            required
          />
        </div>
        <div>
          <label htmlFor="dropOffAddress">Drop Off Address</label>
          <input
            type="text"
            placeholder="Enter Drop-off Address"
            name="dropOffAddress"
            id="dropOffAddress"
            onChange={handleChange}
            value={formData.dropOffAddress}
            required
          />
        </div>
        <div>
          <h2>
            Total Amount: ${calculateTotalAmount(find_car!.rentPrice, formData.pickupDate, formData.dropOffDate)}
          </h2>
        </div>
        <div>
          <button className="booking-btn" type="submit">
            Book Instantly
          </button>
        </div>
      </form>
    </div>
  )
}

export default CarBookingForm
