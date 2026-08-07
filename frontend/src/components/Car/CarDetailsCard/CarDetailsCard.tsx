import "./CarDetailsCard.css";
import React from "react";
import { MdPersonOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { SiSpeedtest } from "react-icons/si";
import { TbManualGearbox } from "react-icons/tb";
import { BiSolidCarMechanic } from "react-icons/bi";
import { Car } from "../../../slices/carSlice";

const formatDate = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const CarDetailsCard: React.FC<Car> = ({
  _id,
  capacity,
  carName,
  image,
  mileage,
  transmission,
  year,
  carNumberPlate,
  rentPricePerDay,
  rentPricePerHour,
  rentPricePerKm,
  isBookedForPeriod,
  conflictingBookings,
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`${_id}`);
  };

  return (
    <div
      className={`CarDetailsCard ${isBookedForPeriod ? 'car-card-booked' : ''}`}
      id={_id}
      onClick={handleNavigate}
    >
      {/* Booked badge */}
      {isBookedForPeriod && (
        <div className="booked-badge-container">
          <span className="booked-badge">Booked</span>
          {/* Tooltip */}
          <div className="booked-tooltip">
            <div className="booked-tooltip-title">🚫 Unavailable</div>
            {conflictingBookings && conflictingBookings.length > 0 ? (
              conflictingBookings.map((booking, idx) => (
                <div key={idx} className="booked-tooltip-row">
                  <span>{formatDate(booking.startDate)}</span>
                  <span className="booked-tooltip-arrow">→</span>
                  <span>{formatDate(booking.endDate)}</span>
                </div>
              ))
            ) : (
              <div className="booked-tooltip-row">Booked for the selected period</div>
            )}
          </div>
        </div>
      )}

      {/* Booked overlay */}
      {isBookedForPeriod && <div className="booked-overlay" />}

      <img src={image} alt="" className="card-details-image" />
      <div className="car-details-text">
        <div className="car-details-text-left">
          <h3>{carName}</h3>
          <div className="rating">
            <p>{carNumberPlate}</p>
          </div>
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
