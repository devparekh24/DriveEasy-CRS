import React, { useState } from 'react';
import "./CarList.css";
import { cars, carsForBooking } from "../../../data/cars";
import { useNavigate } from "react-router-dom";
import { FaGasPump, FaUserFriends, FaTachometerAlt, FaStar, FaArrowRight } from "react-icons/fa";
import { isV2Enabled } from '../../../utils/featureFlags';

interface Car {
  id: number | string;
  image: string;
  name: string;
}

const CarList: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const v2Active = isV2Enabled();

  // Filter or limit showcase cars
  const featuredCars = carsForBooking.slice(0, 6);

  // V1 Classic Car List View
  if (!v2Active) {
    return (
      <div className="v1-cars-list">
        <h1>First Class Car Rental Services</h1>
        <h5>
          We offer professional car rental services in our range of high-end vehicles
        </h5>

        <div className="v1-car-list-container">
          {cars.map((car: Car) => (
            <div className="v1-car-card" id={String(car.id)} key={car.id}>
              <img src={car.image} alt={car.name} className="v1-card-image" />
              <div className="v1-overlay">{car.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // V2 Luxury Supercar Fleet View
  return (
    <div className="luxury-fleet-section">
      <div className="fleet-header-box" data-aos="fade-up">
        <span className="fleet-subtitle-tag">EXCLUSIVE SELECTION</span>
        <h2 className="fleet-main-title">
          OUR FEATURED <span className="gold-text-span">FLEET</span>
        </h2>
        <p className="fleet-description">
          Handpicked premium vehicles maintained to showroom perfection for your driving pleasure
        </p>

        {/* Category Filter Chips */}
        <div className="fleet-filter-tabs">
          <button 
            className={`filter-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Luxury
          </button>
          <button 
            className={`filter-tab ${activeCategory === 'suv' ? 'active' : ''}`}
            onClick={() => setActiveCategory('suv')}
          >
            Premium SUVs
          </button>
          <button 
            className={`filter-tab ${activeCategory === 'sedan' ? 'active' : ''}`}
            onClick={() => setActiveCategory('sedan')}
          >
            Executive Sedans
          </button>
          <button 
            className={`filter-tab ${activeCategory === 'sports' ? 'active' : ''}`}
            onClick={() => setActiveCategory('sports')}
          >
            Sports & Supercars
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="fleet-grid-container" data-aos="fade-up" data-aos-delay="150">
        {featuredCars.map((car) => (
          <div 
            className="fleet-luxury-card" 
            key={car.id}
            onClick={() => navigate(`/cars/${car.id}`)}
          >
            <div className="card-top-bar">
              <span className="car-category-pill">Luxury Edition</span>
              <div className="car-rating">
                <FaStar className="star-icon" />
                <span>4.9</span>
              </div>
            </div>

            <div className="car-image-box">
              <img src={car.image} alt={car.name} className="car-img" />
            </div>

            <div className="car-details-content">
              <h3 className="car-title">{car.name}</h3>
              
              <div className="car-specs-row">
                <div className="spec-item">
                  <FaUserFriends className="spec-icon" />
                  <span>{car.seats} Seats</span>
                </div>
                <div className="spec-item">
                  <FaTachometerAlt className="spec-icon" />
                  <span>{car.gearType}</span>
                </div>
                <div className="spec-item">
                  <FaGasPump className="spec-icon" />
                  <span>Petrol / EV</span>
                </div>
              </div>

              <div className="car-price-bar">
                <div className="price-tag">
                  <span className="currency">₹</span>
                  <span className="amount">{Number(car.ratePerDay) * 80}</span>
                  <span className="per-day">/ day</span>
                </div>

                <button 
                  className="reserve-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/cars/${car.id}`);
                  }}
                >
                  <span>Rent Now</span>
                  <FaArrowRight className="arrow-icon" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Fleet Footer CTA */}
      <div className="fleet-footer-action" data-aos="fade-up">
        <button className="view-all-fleet-btn" onClick={() => navigate('/cars')}>
          <span>Explore Entire Supercar Fleet</span>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default CarList;



