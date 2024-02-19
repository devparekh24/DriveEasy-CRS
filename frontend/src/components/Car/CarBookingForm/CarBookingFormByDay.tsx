import './CarBookingForm.css';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
// import { setBookingData, BookingState } from "../../../slices/bookingSlice";
import { DatePicker } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useBookCarMutation } from '../../../services/bookingApi';
import useRazorpay from "react-razorpay";
// import { addOrder } from '../../../slices/orderSlice';
import razorpayImg from '../../../assets/DriveEasy.png';
import { useAddOrderMutation } from '../../../services/orderApi';
import { toast } from 'react-toastify';

interface initialState {
  fullName: string;
  emailAddress: string;
  phoneNo: string;
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  dropOffAddress: string;
  dropOffDate: string;
  dropOffTime: string;
  totalAmount: number;
  totalKm: number;
  errors: {
    fullName?: string;
    emailAddress?: string;
    phoneNo?: string;
    pickupAddress?: string;
    pickupDate?: string;
    dropOffAddress?: string;
    dropOffDate?: string;
    totalKm?: number;
  };
}
const initialState: initialState = {
  fullName: '',
  emailAddress: '',
  phoneNo: '',
  pickupAddress: '',
  pickupDate: '',
  pickupTime: '',
  dropOffAddress: '',
  dropOffDate: '',
  dropOffTime: '',
  totalAmount: 0,
  totalKm: 0,
  errors: {},
}

dayjs.extend(customParseFormat);
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;

// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};


const CarBookingFormByDay = ({ bookingFormValue }: any) => {

  const navigate = useNavigate()
  const params = useParams<{ id: string }>();
  const cars = useAppSelector(state => state.car.cars)
  const addressState = useAppSelector(state => state.address)

  // const pickupAdd = useAppSelector(state => state.address.pickupAddress)
  // const dropoffAdd = useAppSelector(state => state.address.dropoffAddress)
  // const bookingFormData = useAppSelector(state => state.booking)

  const find_car = cars.find((c: any) => {
    return c._id == params.id;
  });

  const [Razorpay] = useRazorpay();
  const dispatch = useAppDispatch()
  const isLogin = useAppSelector(state => state.auth.isLoggedIn)
  const [bookCar, { data: bookCarData, error: errorOnBookCar, isSuccess: isSuccessOnBookCar, isError: isErrorOnBookCar }] = useBookCarMutation();
  const [addOrder, { data: addOrderData, error: errorOnAddOrder, isError: isErrorOnAddOrder, isSuccess: isSuccessOnAddOrder }] = useAddOrderMutation()
  const [formData, setFormData] = useState<initialState>(initialState)
  const loginUser = useAppSelector(state => state.user.users)

  const calculateTotalAmount = (basePrice: number, pickupDate: string, dropOffDate: string): number => {
    // const pricePerDay = basePrice;
    // Parse input dates
    // const pickupDateTime = Date.parse(pickupDate);
    // const dropOffDateTime = Date.parse(dropOffDate);

    const pickupDateTime = dayjs(pickupDate).toDate().getTime();
    const dropOffDateTime = dayjs(dropOffDate).toDate().getTime();


    // Check if the date parsing was successful
    if (isNaN(pickupDateTime) || isNaN(dropOffDateTime)) {
      // console.error("Invalid date format");
      return 0; // Or handle the error in a way suitable for your application
    }
    // const totalDays = Math.ceil(((dropOffDateTime - pickupDateTime) + 1) / (24 * 60 * 60 * 1000));
    // const totalHours = Math.ceil(((dropOffDateTime - pickupDateTime)) / (60 * 60 * 1000));
    // console.log(totalHours)
    // if (totalDays <= 0
    // || totalHours <= 0
    // ) {
    // console.error("Invalid date range");
    // return 0; // Or handle the error in a way suitable for your application
    // }
    // if (bookingFormValue === 'day') return basePrice * totalDays;
    // if (bookingFormValue === 'hour') return basePrice * totalHours;

    switch (bookingFormValue) {
      case 'day': {
        const totalDays = Math.ceil(((dropOffDateTime - pickupDateTime) + 1) / (24 * 60 * 60 * 1000));
        if (totalDays <= 0) return 0;
        return basePrice * totalDays;
      }

      case 'hour': {
        const totalHours = Math.ceil(((dropOffDateTime - pickupDateTime)) / (60 * 60 * 1000));
        if (totalHours <= 0) return 0;
        return basePrice * totalHours;
      }

      default:
        break;
    }
  };

  const calculateAndSetTotalAmount = () => {

    if (bookingFormValue === 'day') {
      const totalAmount = calculateTotalAmount(find_car!.rentPricePerDay, formData.pickupDate, formData.dropOffDate);
      setFormData(prevData => ({ ...prevData, totalAmount }));
    }
    if (bookingFormValue === 'hour') {
      const totalAmount = calculateTotalAmount(find_car!.rentPricePerHour, formData.pickupDate, formData.dropOffDate);
      setFormData(prevData => ({ ...prevData, totalAmount }));
    }
  };

  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    console.log('Selected Time: ', value?.toString());
    console.log('Formatted Selected Time: ', dateString);

    switch (bookingFormValue) {
      case 'day': {
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
          calculateAndSetTotalAmount()
        }
        break;
      }

      // case 'hour': {
      //   if (Array.isArray(value)) {
      //     const [pickupDate, dropOffDate] = value.map(date => date?.toDate());
      //     const pickupTime = value[0]?.format('HH:mm');
      //     const dropOffTime = value[1]?.format('HH:mm');

      //     setFormData(prevData => ({
      //       ...prevData,
      //       pickupDate: pickupDate?.toString() || '',
      //       dropOffDate: dropOffDate?.toString() || '',
      //       pickupTime: pickupTime?.toString() || '',
      //       dropOffTime: dropOffTime?.toString() || '',
      //     }));
      //     break;
      //   }
      // }
    }
  }
  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    console.log('onOk: ', value!);
  };

  const handlePayment = async (formData: any) => {
    console.log(find_car!._id, formData)
    try {
      // const response = await bookCar({ carId: find_car!._id, bookingData: formData });
      // console.log('Booking successful:', response);
      console.log(formData)

      // Create order on your backend
      const order = await addOrder({ carId: find_car!._id, newOrder: formData }).unwrap();

      console.log(formData.totalAmount)
      const options = {
        key: 'rzp_test_rj5Bthp9EwXcYE', // Replace with your Razorpay key
        amount: (formData?.totalAmount * 100).toString(), // Amount is in currency subunits. Default currency is INR.
        currency: 'INR',
        name: 'Drive Easy',
        description: 'Car Rental Booking',
        order_id: order._id, // Pass the order ID obtained from the backend response
        image: razorpayImg,
        handler: function (response: any) {
          console.log('Payment Succeeded frontend:', response);
          // Handle the successful payment response
          console.log(
            response.razorpay_payment_id
          )
          toast.success('Car Booked Successfully!', {
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
          setFormData(initialState)

        },
        // prefill: {
        //   name: formData.fullName,
        //   email: formData.emailAddress,
        //   contact: formData.phoneNo,
        // },
        theme: {
          color: '#000',
        },
      };
      const rzp = new Razorpay(options);

      rzp.on("payment.failed", function () {
        // alert(response.error.code);
        // alert(response.error.description);
        // alert(response.error.source);
        // alert(response.error.step);
        // alert(response.error.reason);
        // alert(response.error.metadata.order_id);
        // alert(response.error.metadata.payment_id);
        toast.error('Your Payment is Failed! Try Again...', {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      });

      rzp.open();

      if (isErrorOnAddOrder || isErrorOnBookCar) throw errorOnAddOrder || errorOnBookCar
    } catch (error) {
      console.error('Error booking the car:', error);
      toast.error('Error booking the car!', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "totalKm") {
      setFormData((prevData) => ({
        ...prevData,
        totalKm: Number(value), // Convert the input value to a number
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    if (name === "pickupDate" || name === "dropOffDate") {
      calculateAndSetTotalAmount();
    }
  }

  const handleValidation = () => {

    // Simple validation
    const errors: initialState['errors'] = {};
    // Name validation
    const nameRegex = /^[A-Za-z][A-Za-z]+$/;
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    } else if (!nameRegex.test(formData.fullName)) {
      errors.fullName = 'Invalid characters in Full Name';
    }

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!formData.phoneNo.trim()) {
      errors.phoneNo = 'Phone Number is required';
    } else if (!phoneRegex.test(formData.phoneNo)) {
      errors.phoneNo = 'phone number must be 10 digit long only';
    }

    if (!formData.emailAddress.trim()) {
      errors.emailAddress = 'Email Address is required';
    }
    // if (!formData.pickupAddress.trim()) {
    // errors.pickupAddress = 'Pickup Address is required';
    // }
    // if (!formData.pickupDate) {
    //   errors.pickupDate = 'Pickup Date is required';
    // }
    // if (!formData.dropOffAddress.trim()) {
    // errors.dropOffAddress = 'Drop Off Address is required';
    // }
    // if (!formData.dropOffDate) {
    //   errors.dropOffDate = 'Drop Off Date is required';
    // }
    return errors;

    // // If there are errors, don't proceed with the payment
    // if (Object.keys(errors).length === 0) {
    //   handlePayment(formData);
    // }
  }

  const handleSubmitBookingForm = async (event: any) => {
    event.preventDefault();
    const errors = handleValidation();

    if (Object.keys(errors).length === 0) {
      // No errors, proceed with payment or other actions
      // handlePayment(formData);
      isLogin ? (handlePayment(formData)) : (
        <>
          {
            toast.error('You have to Login First!', {
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              onClose: () => navigate('/login')
            })
          }
        </>
      )
    } else {
      // Update state with errors
      setFormData((prevData) => ({ ...prevData, errors }));
    }

  };


  useEffect(() => {
    calculateAndSetTotalAmount();
  }, [find_car, formData.pickupDate, formData.dropOffDate, formData.pickupTime, formData.dropOffTime, bookingFormValue])

  useEffect(() => {
    if (isSuccessOnBookCar) {
      console.log(bookCarData)
      setFormData(initialState)
    }
  }, [isSuccessOnBookCar])

  useEffect(() => {
    if (isSuccessOnAddOrder) {
      console.log(addOrderData)
    }
  }, [isSuccessOnAddOrder])


  return (
    <div>
      <form onSubmit={handleSubmitBookingForm}>
        {
          bookingFormValue === 'day' && (
            <h2>
              ₹{find_car?.rentPricePerDay} <span>Per Day</span>
            </h2>
          )
        }
        {
          bookingFormValue === 'hour' && (
            <h2>
              ₹{find_car?.rentPricePerHour} <span>Per Hour</span>
            </h2>
          )
        }
        {
          bookingFormValue === 'km' && (
            <h2>
              ₹{find_car?.rentPricePerKm} <span>Per Km</span>
            </h2>
          )
        }
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            placeholder="Enter Full Name"
            name="fullName"
            id="fullName"
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            value={loginUser.data?.name}
          // required
          />
          {formData.errors.fullName && <p className="error">{formData.errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="emailAddress">Email Address</label>
          <input
            type="email"
            placeholder="Enter Email"
            name="emailAddress"
            id="emailAddress"
            onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
            value={loginUser.data?.email}
          />
          {formData.errors.emailAddress && <p className="error">{formData.errors.emailAddress}</p>}
        </div>
        <div>
          <label htmlFor="phoneNo">Phone Number</label>
          <input
            type="number"
            maxLength={10}
            minLength={10}
            placeholder="Enter Contact Number"
            name="phoneNo"
            id="phoneNo"
            onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
            value={formData.phoneNo}
          // required
          />
          {formData.errors.phoneNo && <p className="error">{formData.errors.phoneNo}</p>}
        </div>
        <div className='range-picker'>
          <label htmlFor="pickupAddress">Select Date & Time</label>
          {
            bookingFormValue === 'day' && (
              <>
                {/* <label htmlFor="pickupAddress">Select Date (8hrs)</label> */}
                <RangePicker
                  disabledDate={disabledDate}
                  showTime={{
                    hideDisabledOptions: true,
                    // defaultValue: [dayjs('08:00', 'HH:mm'), dayjs('20:00', 'HH:mm')],
                  }}
                  format="YYYY-MM-DD"
                  onChange={onChange}
                  onOk={onOk}
                />
                {/* {(formData.errors.dropOffDate || formData.errors.pickupDate) && <p className="error">{formData.errors.pickupDate || formData.errors.dropOffDate}</p>} */}
              </>
            )
          }
          {
            bookingFormValue === 'hour' && (
              <>
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
                {/* {(formData.errors.dropOffDate || formData.errors.pickupDate) && <p className="error">{formData.errors.pickupDate || formData.errors.dropOffDate}</p>} */}
              </>
            )
          }
          {
            bookingFormValue === 'km' && (
              <>
                <DatePicker
                  format="YYYY-MM-DD HH:mm"
                  disabledDate={disabledDate}
                  showTime={{ defaultValue: dayjs('08:00', 'HH:mm') }}
                />
                {/* {(formData.errors.dropOffDate || formData.errors.pickupDate) && <p className="error">{formData.errors.pickupDate || formData.errors.dropOffDate}</p>} */}
              </>
            )
          }
        </div>
        <div>
          <label htmlFor="pickupAddress">Pickup Address</label>
          <input
            type="text"
            placeholder="Enter Pick-up Address"
            name="pickupAddress"
            id="pickupAddress"
            onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
            value={addressState.pickupAddress}
          // required
          />
          {formData.errors.pickupAddress && <p className="error">{formData.errors.pickupAddress}</p>}
        </div>
        <div>
          <label htmlFor="dropOffAddress">Drop Off Address</label>
          <input
            type="text"
            placeholder="Enter Drop-off Address"
            name="dropOffAddress"
            id="dropOffAddress"
            onChange={(e) => setFormData({ ...formData, dropOffAddress: e.target.value })}
            value={addressState.dropoffAddress}
          // required
          />
          {formData.errors.dropOffAddress && <p className="error">{formData.errors.dropOffAddress}</p>}

        </div>
        <div>
          {
            bookingFormValue === 'day' && (
              <h2>
                Total Amount: ₹{calculateTotalAmount(find_car!.rentPricePerDay, formData.pickupDate, formData.dropOffDate)}
              </h2>)
          }
          {
            bookingFormValue === 'hour' && (
              <h2>
                Total Amount: ₹{calculateTotalAmount(find_car!.rentPricePerHour, formData.pickupDate, formData.dropOffDate)}
              </h2>)
          }
          {
            bookingFormValue === 'km' && (
              <>
                <label htmlFor="totalKm">Total Kilometre </label>
                <input
                  type="number"
                  placeholder="Enter Total Km"
                  name="totalKm"
                  id="totalKm"
                  onChange={(e) => (setFormData({ ...formData, totalKm: +e.target.value }), setFormData({ ...formData, totalAmount: Number(find_car!.rentPricePerKm * addressState.totalKm) }))}
                  value={addressState.totalKm}
                  // value={formData.totalKm}
                  required
                />
                <h2 style={{ marginTop: 20 }}>
                  Total Amount: ₹{Number(find_car!.rentPricePerKm * addressState.totalKm)}
                </h2>
              </>
            )
          }
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

export default CarBookingFormByDay
