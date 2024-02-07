import './CarBookingForm.css';
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { setBookingData, BookingState, initialState } from "../../../slices/bookingSlice";
import { DatePicker } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { toast } from 'react-toastify';

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
  const pickupDateTime = +new Date(pickupDate);
  console.log(pickupDate)
  const dropOffDateTime = +new Date(dropOffDate);
  console.log(dropOffDate)
  const totalDays = Math.ceil((dropOffDateTime - pickupDateTime) / (24 * 60 * 60 * 1000));
  return pricePerDay * totalDays;
};

const CarBookingForm = () => {
  const params = useParams<{ id: string }>();
  const cars = useAppSelector(state => state.car.cars)
  const pickupAdd = useAppSelector(state => state.address.pickupAddress)
  const dropoffAdd = useAppSelector(state => state.address.dropoffAddress)
  const formData = useAppSelector(state => state.booking)
  const find_car = cars.find((c: any) => {
    return c._id == params.id;
  });

  const dispatch = useAppDispatch()

  const [bookingFormData, setBookingFormData] = useState<BookingState>(initialState)

  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);

    if (Array.isArray(dateString)) {
      const [pickupDate, dropOffDate] = dateString.map(item => item.split(' ')[0]);
      const [pickupTime, dropOffTime] = dateString.map(item => item.split(' ')[1]);

      setBookingFormData(prevData => ({
        ...prevData,
        pickupDate,
        dropOffDate,
        pickupTime,
        dropOffTime,
      }));

      dispatch(setBookingData({
        pickupDate,
        dropOffDate,
        pickupTime,
        dropOffTime,
      }));
    }
  };

  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    console.log('onOk: ', value!);

    // if (value[0]!) {
    //   const { $d } = value[0]!
    //   console.log($d)
    //   toast.info(`Your Pick up Date! ${$d}`, {
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //   })
    // }
    // if (value[1]!) {
    //   const { $d } = value[1]!
    //   console.log($d)
    //   toast.info(`Your Drop off Date! ${$d}`, {
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //   })
    // }
  };
  const handleSubmitBookingForm = (event: any) => {
    event.preventDefault();
    console.log(bookingFormData)
    dispatch(setBookingData(bookingFormData))
    setBookingFormData(initialState)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
    if (name === "pickupDate" || name === "dropOffDate") {
      const totalAmount = calculateTotalAmount(find_car!.rentPrice, bookingFormData.pickupDate, bookingFormData.dropOffDate)
      setBookingFormData((prevData) => ({
        ...prevData,
        totalAmount,
      }))
    }
  }
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
            value={bookingFormData.fullName}
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
            value={bookingFormData.emailAddress}
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
            value={bookingFormData.phoneNo}
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
            format="DD-MM-YYYY HH:mm"
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
            value={bookingFormData.pickupAddress}
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
            value={bookingFormData.dropOffAddress}
            required
          />
        </div>
        <div>
          <h3>
            {/* Total Amount: ${bookingFormData.totalAmount} */}
            Total Amount: {find_car!.rentPrice > bookingFormData.totalAmount ? find_car!.rentPrice : bookingFormData.totalAmount}
          </h3>
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
