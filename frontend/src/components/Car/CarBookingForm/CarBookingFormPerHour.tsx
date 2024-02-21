import './CarBookingForm.css';
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { DatePicker } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useBookCarMutation } from '../../../services/bookingApi';
import useRazorpay from "react-razorpay";
import razorpayImg from '../../../assets/DriveEasy.png';
import { useAddOrderMutation } from '../../../services/orderApi';
import { toast } from 'react-toastify';

interface initialState {
    fullName: string;
    emailAddress: string;
    phoneNo: string;
    pickupAddress: string;
    pickupDateAndTime: Date | string;
    dropOffAddress: string;
    dropOffDateAndTime: Date | string;
    totalAmount: number;
    totalKm: number;
}
const initialState: initialState = {
    fullName: '',
    emailAddress: '',
    phoneNo: '',
    pickupAddress: '',
    pickupDateAndTime: '',
    dropOffAddress: '',
    dropOffDateAndTime: '',
    totalAmount: 0,
    totalKm: 0,
}

dayjs.extend(customParseFormat);
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;

// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
};


const CarBookingFormPerHour = () => {

    const navigate = useNavigate()
    const params = useParams<{ id: string }>();
    const cars = useAppSelector(state => state.car.cars)
    const addressState = useAppSelector(state => state.address)
    const loginUser = useAppSelector(state => state.user.users)

    const [totalNumberOfHours, setTotalNumberOfHours] = useState(0)
    const fullNameRef = useRef<HTMLInputElement | null>(null)
    const emailAddressRef = useRef<HTMLInputElement | null>(null)
    const phoneNoRef = useRef<HTMLInputElement | null>(null)
    const pickupAddressRef = useRef<HTMLInputElement | null>(null)
    const dropOffAddressRef = useRef<HTMLInputElement | null>(null)

    const find_car = cars.find((c: any) => {
        return c._id == params.id;
    });

    const [Razorpay] = useRazorpay();
    const dispatch = useAppDispatch()
    const isLogin = useAppSelector(state => state.auth.isLoggedIn)
    const [bookCar, { data: bookCarData, error: errorOnBookCar, isSuccess: isSuccessOnBookCar, isError: isErrorOnBookCar }] = useBookCarMutation();
    const [addOrder, { data: addOrderData, error: errorOnAddOrder, isError: isErrorOnAddOrder, isSuccess: isSuccessOnAddOrder }] = useAddOrderMutation()
    // const [formData, setFormData] = useState<initialState>(initialState)

    const [formData, setFormData] = useState<initialState>({
        fullName: loginUser?.data?.name,
        emailAddress: loginUser?.data?.email,
        phoneNo: loginUser?.data?.contactNumber,
        pickupAddress: addressState?.pickupAddress,
        dropOffAddress: addressState?.dropoffAddress,
        dropOffDateAndTime: '',
        pickupDateAndTime: '',
        totalAmount: 0,
        totalKm: 0,
    });

    const calculateTotalAmount = (basePrice: number, pickupDate: string, dropOffDate: string): number | undefined => {

        const pickupDateTime = dayjs(pickupDate).toDate().getTime();
        const dropOffDateTime = dayjs(dropOffDate).toDate().getTime();

        // Check if the date parsing was successful
        if (isNaN(pickupDateTime) || isNaN(dropOffDateTime)) {
            // console.error("Invalid date format");
            return 0;
        }
        const totalHours = Math.ceil(((dropOffDateTime - pickupDateTime)) / (60 * 60 * 1000));
        console.log('totalHours----', totalHours)
        if (totalHours <= 0) return 0;
        return basePrice * totalHours;
    };

    const calculateAndSetTotalAmount = () => {
        const totalAmount = calculateTotalAmount(find_car!.rentPricePerHour, formData.pickupDateAndTime.toString(), formData.dropOffDateAndTime.toString())!;
        setFormData(prevData => ({ ...prevData, totalAmount }));
    };

    const onChange = (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,
    ) => {
        // console.log('Selected Time: ', value?.toString());
        // console.log('Formatted Selected Time: ', dateString);

        if (Array.isArray(value)) {
            const [pickupDate, dropOffDate] = value.map(date => date?.toDate());

            // Calculate the total hours between pickup and drop-off dates
            const totalHours = dayjs(dropOffDate).diff(pickupDate, 'hour');
            // console.log(totalHours)
            // totalNumberOfHours = totalHours
            setTotalNumberOfHours(totalHours)
            setFormData(prevData => ({
                ...prevData,
                pickupDateAndTime: pickupDate!,
                dropOffDateAndTime: dropOffDate!,
            }));
            calculateAndSetTotalAmount()
        }
    }

    const handlePayment = async (formData: any) => {

        try {

            // Create order on your backend
            const order = await addOrder({ carId: find_car!._id, newOrder: { ...formData } }).unwrap();

            const options = {
                key: 'rzp_test_rj5Bthp9EwXcYE', // Replace with your Razorpay key
                amount: (formData?.totalAmount * 100).toString(), // Amount is in currency subunits. Default currency is INR.
                currency: 'INR',
                name: 'Drive Easy',
                description: 'Car Rental Booking',
                order_id: order._id, // Pass the order ID obtained from the backend response
                image: razorpayImg,
                handler: function (response: any) {
                    // Handle the successful payment response
                    console.log('Payment Succeeded frontend:', response);
                    toast.success('Car Booked Successfully!', {
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    })
                    setFormData(initialState)

                },
                prefill: {
                    name: formData.fullName,
                    email: formData.emailAddress,
                    contact: formData.phoneNo,
                },
                theme: {
                    color: '#000',
                },
            };
            const rzp = new Razorpay(options);

            rzp.on("payment.failed", function () {
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
        setFormData(initialState)
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "pickupDateAndTime" || name === "dropOffDateAndTime") {
            calculateAndSetTotalAmount();
        }
    }

    
    const handleSubmitBookingForm = async (event: any) => {
        event.preventDefault();
        const fullName = fullNameRef!.current!.value!
        const emailAddress = emailAddressRef!.current!.value!
        const phoneNo = phoneNoRef!.current!.value!

        // console.log(fullName, emailAddress, phoneNo, pickupAddress, dropOffAddress)
        console.log(formData)

        const handleValidation = () => {
            // Name validation
            const nameRegex = /^[a-zA-Z]{1,}(?: [a-zA-Z]+){0,2}$/;
            if (!fullName!.trim()) {
                toast.error('Full Name is required', {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
                return false
            } else if (!nameRegex.test(fullName!)) {
                toast.error('Invalid characters in Full Name', {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
                return false
            }

            // Phone number validation
            const phoneRegex = /^\d{10}$/;
            if (!phoneNo!.trim()) {
                toast.error('Phone Number is required', {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
                return false
            } else if (!phoneRegex.test(phoneNo!)) {
                toast.error('Phone number must be 10 digit long only', {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
                return false
            }

            if (!emailAddress!.trim()) {
                toast.error('Email Address is required', {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
                return false
            }

            // RangePicker validation
            if (!formData.pickupDateAndTime || !formData.dropOffDateAndTime) {
                toast.error('Please select valid pickup and drop-off dates.', {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return false;
            }

            return true;
        }

        const success = handleValidation();
        if (success) {
            // No errors, proceed with payment or other actions
            isLogin ? (handlePayment(formData)) : (
                <>
                    {toast.error('You have to Login First!', {
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
        }
    };

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            pickupAddress: addressState?.pickupAddress,
            dropOffAddress: addressState?.dropoffAddress,
        }));
    }, [addressState]);

    useEffect(() => {
        calculateAndSetTotalAmount();
    }, [find_car, formData.dropOffDateAndTime, formData.pickupDateAndTime])

    useEffect(() => {
        if (isSuccessOnBookCar) {
            console.log(bookCarData)
            setFormData(initialState)
        }
    }, [isSuccessOnBookCar])

    useEffect(() => {
        if (isSuccessOnAddOrder) {
            console.log(addOrderData)
            setTotalNumberOfHours(0)
            setFormData(initialState)
        }
    }, [isSuccessOnAddOrder])


    return (
        <div>
            <form onSubmit={handleSubmitBookingForm}>
                <h2>
                    ₹{find_car?.rentPricePerHour} <span>Per Hour</span>
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
                        ref={fullNameRef}
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
                        ref={emailAddressRef}
                    />
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
                        onChange={handleChange}
                        value={formData.phoneNo}
                        ref={phoneNoRef}
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
                    />
                    {<h4>Total Hours: {totalNumberOfHours}</h4>}
                </div>
                <div>
                    <label htmlFor="pickupAddress">Pickup Address</label>
                    <input
                        type="text"
                        placeholder="Enter Pick-up Address"
                        name="pickupAddress"
                        id="pickupAddress"
                        onChange={handleChange}
                        value={formData.pickupAddress || addressState.pickupAddress}
                        ref={pickupAddressRef}
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
                        value={formData.dropOffAddress || addressState.dropoffAddress}
                        ref={dropOffAddressRef}
                        required
                    />
                </div>
                <div>
                    <h2>
                        Total Amount: ₹{calculateTotalAmount(find_car!.rentPricePerHour, formData.pickupDateAndTime.toString(), formData.dropOffDateAndTime.toString())}
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

export default CarBookingFormPerHour
