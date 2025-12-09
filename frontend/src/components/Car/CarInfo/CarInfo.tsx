import "./CarInfo.css";
import React, { useEffect, useState } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import LeafletMap from "../../Map/LeafletMap";
import CarBookingFormPerDay from "../CarBookingForm/CarBookingFormPerDay";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { SiSpeedtest } from "react-icons/si";
import { TbManualGearbox } from "react-icons/tb";
import { BiSolidCarMechanic } from "react-icons/bi";
import { toast } from "react-toastify";
import { useGetAllCarsQuery } from "../../../services/carApi";
import { setCars } from "../../../slices/carSlice";
import Loader from "../../Loader/Loader";
import { AiOutlineCheck } from "react-icons/ai";
import type { RadioChangeEvent } from 'antd';
import { ConfigProvider, Radio } from 'antd';
import CarBookingFormPerHour from "../CarBookingForm/CarBookingFormPerHour";
import CarBookingFormPerKm from "../CarBookingForm/CarBookingFormPerKm";

const CarInfo: React.FC = () => {
  const { data, isError, isLoading, error, isSuccess } = useGetAllCarsQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const carData = async () => {
    try {
      if (isError) {
        throw error
      }
      await data
    }
    catch (error: any) {
      toast.error(error?.data?.message, {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  useEffect(() => {
    carData()
    if (isSuccess && data && (data as any).data) {
      dispatch(setCars({ data: (data as any).data }))
    }
  }, [dispatch, isSuccess, carData])

  const params = useParams<{ id: string }>();
  const cars = useAppSelector(state => state.car.cars)
  const find_car = cars.find((c: any) => {
    return c._id == params.id;
  });

  const [bookingFormValue, setBookingFormValue] = useState<string>('day');

  const onChange = (e: RadioChangeEvent) => {
    setBookingFormValue(e.target.value);
  };

  return (
    <>
      {isLoading && <Loader />}
      {find_car && (
        <div className="car-info">
          <div className="car-info-row">
            <div className="car-info-text-col">
              <h3 onClick={() => navigate('/cars')} style={{ cursor: 'pointer' }}> <u>Go Back</u></h3>
              <div className="car-image">
                <img src={find_car?.image} alt={find_car?.image} />
              </div>
              <h1>{find_car?.carName} - {find_car?.companyName}</h1>
              <div className="car-interior-info">
                <div>
                  <span>{find_car?.carNumberPlate}</span>
                </div>
                <div>
                  <IoPersonOutline className="car-info-icon" />
                  <span>{find_car?.capacity}</span>
                  <p>Passengers</p>
                </div>
                <div>
                  <SiSpeedtest className="car-info-icon" />
                  <span>{find_car?.mileage}</span>
                  <p>KMPL</p>
                </div>
                <div>
                  <TbManualGearbox className="car-info-icon" />
                  <p className="auto">{find_car?.transmission}</p>
                </div>
                <div>
                  <BiSolidCarMechanic className="car-info-icon" />
                  <span>{find_car?.year} (MFG)</span>
                </div>
              </div>
              <div className="include">
                <div>
                  <h3>Included</h3>
                </div>
                <div>
                  <p>
                    <AiOutlineCheck className="check-icon" />
                    Audio input
                  </p>
                  <p>
                    <AiOutlineCheck className="check-icon" />
                    Bluetooth
                  </p>
                  <p>
                    <AiOutlineCheck className="check-icon" />
                    Heated seats
                  </p>
                </div>
                <div>
                  <p>
                    <AiOutlineCheck className="check-icon" />
                    All Wheel drive
                  </p>
                  <p>
                    <AiOutlineCheck className="check-icon" />
                    USB input
                  </p>
                  <p>
                    <AiOutlineCheck className="check-icon" />
                    FM Radio
                  </p>
                </div>
              </div>
              <br />
              <div className="car-route-map">
                <LeafletMap />
              </div>
            </div>
            <div className="car-info-form-col">
              <h1 style={{ display: 'flex', justifyContent: 'center' }}>Rental Booking Form</h1>
              <ConfigProvider
                theme={{
                  token: {
                    // Seed Token
                    colorPrimary: '#000',

                    // Alias Token
                    colorBgContainer: '#d1d1d1',
                  },
                }}
              >
                <Radio.Group onChange={onChange} value={bookingFormValue}>
                  <Radio value='day'><h3>Booking Per Day</h3></Radio>
                  <Radio value='hour'><h3>Booking Per Hour</h3></Radio>
                  <Radio value='km'><h3>Booking Per Km</h3></Radio>
                </Radio.Group>
              </ConfigProvider>
              {bookingFormValue === 'day' && <CarBookingFormPerDay />}
              {bookingFormValue === 'hour' && <CarBookingFormPerHour />}
              {bookingFormValue === 'km' && <CarBookingFormPerKm />}
            </div>
          </div>
        </div >
      )
      }
    </>
  );
};

export default CarInfo;
