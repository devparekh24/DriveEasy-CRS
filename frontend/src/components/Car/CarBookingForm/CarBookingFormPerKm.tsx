import './CarBookingForm.css';
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { DatePicker } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
// import { useBookCarMutation } from '../../../services/bookingApi';
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


const CarBookingFormPerKm = () => {

    const navigate = useNavigate()
    const params = useParams<{ id: string }>();
    const cars = useAppSelector(state => state.car.cars)
    const addressState = useAppSelector(state => state.address)
    const loginUser = useAppSelector(state => state.user.users)
    const fullNameRef = useRef<HTMLInputElement | null>(null)
    const emailAddressRef = useRef<HTMLInputElement | null>(null)
    const phoneNoRef = useRef<HTMLInputElement | null>(null)
    const pickupAddressRef = useRef<HTMLInputElement | null>(null)
    const dropOffAddressRef = useRef<HTMLInputElement | null>(null)
    const totalKmRef = useRef<HTMLInputElement | null>(null)

    const find_car = cars.find((c: any) => {
        return c._id == params.id;
    });

    const [Razorpay] = useRazorpay();
    const dispatch = useAppDispatch()
    const isLogin = useAppSelector(state => state.auth.isLoggedIn)
    // const [bookCar, { data: bookCarData, error: errorOnBookCar, isSuccess: isSuccessOnBookCar, isError: isErrorOnBookCar }] = useBookCarMutation();
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

    const calculateTotalAmount = (basePrice: number, totalKm: number): number | undefined => {
        return Number(basePrice * totalKm)
    };

    const calculateAndSetTotalAmount = () => {
        const totalAmount = calculateTotalAmount(find_car!.rentPricePerKm, addressState.totalKm)!;
        setFormData(prevData => ({ ...prevData, totalAmount }));
    };

    const onChange = (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,
    ) => {
        // console.log('Selected Time: ', value?.toString());
        // console.log('Formatted Selected Time: ', dateString)

        if (value) {
            const pickupDate = value?.toDate();
            setFormData(prevData => ({
                ...prevData,
                pickupDateAndTime: pickupDate!,
                dropOffDateAndTime: pickupDate!,
            }));
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

            if (isErrorOnAddOrder) throw errorOnAddOrder
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
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        // console.log(object)
        setFormData((prev) => ({
            ...prev,
            pickupAddress: pickupAddressRef.current?.value!,
            dropOffAddress: dropOffAddressRef.current?.value!,
            totalKm: addressState.totalKm,
        }))
    }

    const handleSubmitBookingForm = async (event: any) => {
        event.preventDefault();
        const fullName = fullNameRef!.current!.value!
        const emailAddress = emailAddressRef!.current!.value!
        const phoneNo = phoneNoRef!.current!.value!
        const pickupAddress = pickupAddressRef!.current!.value!
        const dropOffAddress = dropOffAddressRef!.current!.value!
        const totalKm = totalKmRef!.current!.value!

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
        calculateAndSetTotalAmount();
    }, [find_car, addressState.totalKm])

    useEffect(() => {
        if (isSuccessOnAddOrder) {
            console.log(addOrderData)
            setFormData(initialState)
        }
    }, [isSuccessOnAddOrder])


    return (
        <div>
            <form onSubmit={handleSubmitBookingForm}>
                <h2>
                    ₹{find_car?.rentPricePerKm} <span>Per Km</span>
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
                    <DatePicker
                        format="YYYY-MM-DD HH:mm"
                        disabledDate={disabledDate}
                        showTime={{ defaultValue: dayjs('08:00', 'HH:mm') }}
                        onChange={onChange}
                    />
                </div>
                <div>
                    <label htmlFor="location"><h3>Select Pick-Up & Drop-Off Address From Map</h3></label>
                    <label htmlFor="pickupAddress">Pickup Address</label>
                    <input
                        type="text"
                        placeholder="Enter Pick-up Address"
                        name="pickupAddress"
                        id="pickupAddress"
                        onChange={handleChange}
                        value={addressState.pickupAddress}
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
                        value={addressState.dropoffAddress}
                        ref={dropOffAddressRef}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="totalKm">Total Kilometre </label>
                    <input
                        type="number"
                        placeholder="Enter Total Km"
                        name="totalKm"
                        id="totalKm"
                        onChange={(e) => {
                            const totalKm = +e.target.value;
                            const totalAmount = find_car?.rentPricePerKm! * addressState.totalKm;
                            setFormData({
                                ...formData,
                                totalKm,
                                totalAmount,
                            });
                        }}
                        value={addressState.totalKm}
                        ref={totalKmRef}
                        required
                    />
                    <h2 style={{ marginTop: 20 }}>
                        Total Amount: ₹{Number(find_car!.rentPricePerKm * addressState.totalKm)}
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

export default CarBookingFormPerKm
