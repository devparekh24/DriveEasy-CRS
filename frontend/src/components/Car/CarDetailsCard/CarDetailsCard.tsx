import "./CarDetailsCard.css";
import React from "react";
import { MdPersonOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { SiSpeedtest } from "react-icons/si";
import { TbManualGearbox } from "react-icons/tb";
import { BiSolidCarMechanic } from "react-icons/bi";
import { Car } from "../../../slices/carSlice";

const CarDetailsCard: React.FC<Car> = ({
  _id,
  availability,
  capacity,
  carName,
  color,
  companyName,
  fule,
  image,
  mileage,
  transmission,
  year,
  carNumberPlate,
  rentPricePerDay,
  rentPricePerHour,
  rentPricePerKm,
  whenWillCarAvailable,
  bookedDates
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`${_id}`);
  };

  return (
    <div className="CarDetailsCard" id={_id} onClick={handleNavigate}>
      <img src={image} alt="" className="card-details-image" />
      <div className="car-details-text">
        <div className="car-details-text-left">
          <h3>{carName}</h3>
          <p className="rating">
            <p>{carNumberPlate}</p>
          </p>
          <p className="info-icons">
            <span className="info-icon">
              <MdPersonOutline />
            </span>
            <span className="info-icon">
              <SiSpeedtest />
            </span>
            <span className="info-icon">
              <TbManualGearbox />
            </span>
            <span className="info-icon">
              <BiSolidCarMechanic />
            </span>
          </p>
          <p className="info">
            <span>{capacity}</span>
            <span>{mileage}kmpl</span>
            <span>{transmission}</span>
            <span>{year}</span>
          </p>
        </div>
        <div className="car-details-text-right">
          <h3 className="price">
            ₹{rentPricePerDay} <span>Per Day</span>
          </h3>
          <h3 className="price">
            ₹{rentPricePerHour} <span>Per Hour</span>
          </h3>
          <h3 className="price">
            ₹{rentPricePerKm} <span>Per Km</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsCard;
