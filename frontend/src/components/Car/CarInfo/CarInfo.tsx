import "./CarInfo.css";
import React, { useState } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { PiBagLight } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";
import { AiOutlineCar } from "react-icons/ai";
import { carsForBooking } from "../../../data/cars";
import { useLocation, useParams } from "react-router-dom";
import LeafletMap from "../../Map/LeafletMap";

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

const CarInfo: React.FC = () => {
  const location = useLocation();
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

  // const formik = useFormik({
  //   initialValues: {
  //     fullName: "",
  //     emailAddress: "",
  //     phoneNo: "",
  //     pickupAddress: "",
  //     pickupDate: "",
  //     pickupTime: "",
  //     dropOffAddress: "",
  //     dropOffDate: "",
  //     dropOffTime: "",
  //   },
  //   validate,
  //   onSubmit: (values) => {
  //     alert(JSON.stringify(values, null, 2));
  //   },
  // });

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
    <>
      <div className="car-info">
        <div className="car-info-row">
          <div className="car-info-text-col">
            <div className="car-image">
              <img src={find_car?.image} alt={find_car?.image} />
            </div>
            <h1>{find_car?.name}</h1>
            <p>reviews</p>
            <div className="car-interior-info">
              <div>
                <IoPersonOutline className="car-info-icon" />
                <span>{find_car?.seats}</span>
                <p>Passengers</p>
              </div>
              <div>
                <PiBagLight className="car-info-icon" />
                <span>{find_car?.luggage}</span>
                <p>Luggages</p>
              </div>
              <div>
                <VscSettings className="car-info-icon" />
                <p className="auto">{find_car?.gearType}</p>
              </div>
              <div>
                <AiOutlineCar className="car-info-icon" />
                <span>{find_car?.doors}</span>
                <p>Doors</p>
              </div>
            </div>
            <div className="car-route-map">
              <LeafletMap />
            </div>
          </div>
          <div className="car-info-form-col">
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
        </div>
      </div>
    </>
  );
};

export default CarInfo;
