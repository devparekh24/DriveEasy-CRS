import "./CarInfo.css";
import React, { useEffect } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import LeafletMap from "../../Map/LeafletMap";
import CarBookingForm from "../CarBookingForm/CarBookingFormByDay";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { SiSpeedtest } from "react-icons/si";
import { TbManualGearbox } from "react-icons/tb";
import { BiSolidCarMechanic } from "react-icons/bi";
import { toast } from "react-toastify";
import { useGetAllCarsQuery } from "../../../services/carApi";
import { setCars } from "../../../slices/carSlice";
import Loader from "../../Loader/Loader";

const CarInfo: React.FC = () => {
  const { data, isError, isLoading, error, isSuccess } = useGetAllCarsQuery();
  const dispatch = useAppDispatch();

  const carData = async () => {
    try {
      if (isLoading) console.log('loading...')
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
    if (isSuccess && data && data.data) {
      dispatch(setCars(data?.data))
    }
  }, [dispatch, isSuccess, carData])

  const params = useParams<{ id: string }>();
  const cars = useAppSelector(state => state.car.cars)
  const find_car = cars.find((c: any) => {
    return c._id == params.id;
  });

  return (
    <>
      {isLoading && <Loader />}
      {find_car && (
        <div className="car-info">
          <div className="car-info-row">
            <div className="car-info-text-col">
              <div className="car-image">
                <img src={find_car?.image} alt={find_car?.image} />
              </div>
              <h1>{find_car?.carName} - {find_car?.companyName}</h1>
              {/* <p>reviews</p> */}
              <div className="car-interior-info">
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
                  <span>{find_car?.year} (Manufacturing year)</span>
                </div>
              </div>
              <div className="car-route-map">
                <LeafletMap />
              </div>
            </div>
            <div className="car-info-form-col">
              <CarBookingForm />
            </div>
          </div>
        </div>
      )
      }
    </>
  );
};

export default CarInfo;
