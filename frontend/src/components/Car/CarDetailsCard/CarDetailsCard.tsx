import "./CarDetailsCard.css";
import React from "react";
import { AiOutlineStar } from "react-icons/ai";
import { MdPersonOutline } from "react-icons/md";
import { PiBagLight } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { SiSpeedtest } from "react-icons/si";
import { GiGearStickPattern } from "react-icons/gi";
import { TbManualGearbox } from "react-icons/tb";
import { BiSolidCarMechanic } from "react-icons/bi";

interface CarDetailsCardProps {
  id: string;
  carName: string;
  companyName: string;
  mileage: number;
  year: string;
  capacity: number;
  color: string;
  availability: boolean;
  rentPrice: number;
  image: string;
  fule: string;
  transmission: string;

}

const CarDetailsCard: React.FC<CarDetailsCardProps> = ({
  id,
  availability,
  capacity,
  carName,
  color,
  companyName,
  fule,
  image,
  mileage,
  rentPrice,
  transmission,
  year
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`${id}`);
  };

  return (
    <div className="CarDetailsCard" id={id} onClick={handleNavigate}>
      <img src={image} alt="" className="card-details-image" />
      <div className="car-details-text">
        <h3>{carName}</h3>
        <h3 className="price">
          ₹{rentPrice} <span>Per Day</span>
        </h3>
        <p className="rating">
          <span className="rating-icon">
            <AiOutlineStar />
          </span>
          <span className="rating-icon">
            <AiOutlineStar />
          </span>
          <span className="rating-icon">
            <AiOutlineStar />
          </span>
          <span className="rating-icon">
            <AiOutlineStar />
          </span>
          <span className="rating-icon">
            <AiOutlineStar />
          </span>
          <span className="reviews">4 reviews</span>
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
    </div>
  );
};

export default CarDetailsCard;
