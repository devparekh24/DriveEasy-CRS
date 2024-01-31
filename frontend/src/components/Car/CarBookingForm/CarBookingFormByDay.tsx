// import "./CarInfo.css";
import React, { useState } from "react";
import { carsForBooking } from "../../../data/cars";
import { useParams } from "react-router-dom";

interface FormValues {
  fullName: string;
  emailAddress: string;
  phoneNo: string;
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  dropOffAddress: string;
  dropOffDate: string;
  dropOffTime: string;
}

const CarBookingForm = () => {
  const params = useParams<{ id: string }>();
  const find_car = carsForBooking.find((c: any) => {
    return c.id == params.id;
  });

  const [bookingFormData, setBookingFormData] = useState<FormValues>({
    fullName: "",
    emailAddress: "",
    phoneNo: "",
    pickupAddress: "",
    pickupDate: "",
    pickupTime: "",
    dropOffAddress: "",
    dropOffDate: "",
    dropOffTime: "",
  })


  const handleSubmitBookingForm = (event: any) => {
    event.preventDefault();
    console.log(bookingFormData)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  return (
    <div>
      <form onSubmit={handleSubmitBookingForm}>
        <h2>
          ${find_car?.ratePerDay} <span>Per Day</span>
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
          />
        </div>
        <div>
          <label htmlFor="pickupDate">Pickup Date</label>
          <input
            type="date"
            name="pickupDate"
            id="pickupDate"
            onChange={handleChange}
            value={bookingFormData.pickupDate}
          />
        </div>
        <div>
          <label htmlFor="pickupTime">Pickup Time</label>
          <input
            type="time"
            name="pickupTime"
            id="pickupTime"
            onChange={handleChange}
            value={bookingFormData.pickupTime}
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
          />
        </div>
        <div>
          <label htmlFor="dropOffDate">Drop Off Date</label>
          <input
            type="date"
            name="dropOffDate"
            id="dropOffDate"
            onChange={handleChange}
            value={bookingFormData.dropOffDate}
          />
        </div>
        <div>
          <label htmlFor="dropOffTime">Drop Off Time</label>
          <input
            type="time"
            name="dropOffTime"
            id="dropOffTime"
            onChange={handleChange}
            value={bookingFormData.dropOffTime}
          />
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
