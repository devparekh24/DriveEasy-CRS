import "./CarInfo.css";
import React, { useState } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { PiBagLight } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";
import { AiOutlineCar } from "react-icons/ai";
import { carsForBooking } from "../../../data/cars";
import { useLocation, useParams } from "react-router-dom";
import LeafletMap from "../../Map/LeafletMap";
import CarBookingForm from "../CarBookingForm/CarBookingFormByDay";

const CarInfo: React.FC = () => {
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const find_car = carsForBooking.find((c: any) => {
    return c.id == params.id;
  });

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
            <CarBookingForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default CarInfo;
