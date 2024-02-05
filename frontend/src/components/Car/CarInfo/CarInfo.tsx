import "./CarInfo.css";
import React, { useEffect, useState } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { useLocation, useParams } from "react-router-dom";
import LeafletMap from "../../Map/LeafletMap";
import CarBookingForm from "../CarBookingForm/CarBookingFormByDay";
import { useAppSelector } from "../../../hooks/hooks";
import { SiSpeedtest } from "react-icons/si";
import { TbManualGearbox } from "react-icons/tb";
import { BiSolidCarMechanic } from "react-icons/bi";

const CarInfo: React.FC = () => {
  // const location = useLocation();
  // const { data, isError, isLoading, error } = useGetAllCarsQuery();
  // const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();
  const cars = useAppSelector(state => state.car.cars)
  const find_car = cars.find((c: any) => {
    return c._id == params.id;
  });

  return (
    <>
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
    </>
  );
};

export default CarInfo;
