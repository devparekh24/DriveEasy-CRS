import React, { useState } from 'react';
import './Hero.css';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaRegCalendarAlt, FaMapMarkerAlt, FaAward, FaArrowRight } from 'react-icons/fa';
import { isV2Enabled } from '../../utils/featureFlags';

interface HeroProps { }

const Hero: React.FC<HeroProps> = () => {
  const navigate = useNavigate();
  const [pickupCity, setPickupCity] = useState('Mumbai');
  const [carType, setCarType] = useState('all');
  const [pickupDate, setPickupDate] = useState('');
  const [dropDate, setDropDate] = useState('');
  const v2Active = isV2Enabled();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/cars');
  };

  // V1 Classic Hero Section
  if (!v2Active) {
    return (
      <div className="v1-hero-section">
        <h1>Find Best Car & Limousine</h1>
        <h6>From as low as ₹3300 per day with limited time offer discounts</h6>
      </div>
    );
  }

  // V2 Luxury Hero Showcase Section
  return (
    <div className="hero-luxury-wrapper">
      {/* Dark Ambient Overlay */}
      <div className="hero-ambient-glow"></div>
      
      <div className="hero-container">
        {/* Top Luxury Badge */}
        <div className="luxury-badge" data-aos="fade-down">
          <FaAward className="gold-star-icon" />
          <span>FIRST-CLASS LUXURY CAR RENTAL</span>
        </div>

        {/* Hero Headings */}
        <h1 className="hero-main-title" data-aos="fade-up">
          DRIVE EXCELLENCE. <br />
          <span className="gold-gradient-text">EMBRACE LUXURY.</span>
        </h1>
        
        <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="100">
          Experience the pinnacle of automotive elegance with DriveEasy’s curated fleet 
          of world-class supercars, executive sedans, and luxury SUVs.
        </p>

        {/* Floating Glass Quick Search Widget */}
        <div className="hero-glass-search-widget" data-aos="zoom-in" data-aos-delay="200">
          <form onSubmit={handleSearch} className="search-widget-form">
            {/* Field 1: Location */}
            <div className="widget-field">
              <label><FaMapMarkerAlt className="field-icon" /> Pickup Location</label>
              <select 
                value={pickupCity} 
                onChange={(e) => setPickupCity(e.target.value)}
                className="widget-select"
              >
                <option value="Mumbai">Mumbai (Airport / Downtown)</option>
                <option value="Delhi">Delhi NCR (Aerocity)</option>
                <option value="Bengaluru">Bengaluru (UB City)</option>
                <option value="Goa">Goa (Airport Delivery)</option>
                <option value="Hyderabad">Hyderabad (Jubilee Hills)</option>
              </select>
            </div>

            {/* Field 2: Car Type */}
            <div className="widget-field">
              <label><FaCar className="field-icon" /> Vehicle Category</label>
              <select 
                value={carType} 
                onChange={(e) => setCarType(e.target.value)}
                className="widget-select"
              >
                <option value="all">All Luxury Fleet</option>
                <option value="supercar">Supercars & Sports</option>
                <option value="sedan">Executive Luxury Sedans</option>
                <option value="suv">Premium SUV & Offroad</option>
              </select>
            </div>

            {/* Field 3: Dates */}
            <div className="widget-field">
              <label><FaRegCalendarAlt className="field-icon" /> Pickup Date</label>
              <input 
                type="date" 
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="widget-input"
              />
            </div>

            {/* Field 4: Dropoff */}
            <div className="widget-field">
              <label><FaRegCalendarAlt className="field-icon" /> Return Date</label>
              <input 
                type="date" 
                value={dropDate}
                onChange={(e) => setDropDate(e.target.value)}
                className="widget-input"
              />
            </div>

            {/* CTA Button */}
            <div className="widget-field widget-field-btn">
              <button type="submit" className="hero-search-btn">
                <span>Explore Fleet</span>
                <FaArrowRight className="btn-arrow" />
              </button>
            </div>
          </form>
        </div>

        {/* Hero Quick Action Buttons */}
        <div className="hero-cta-group" data-aos="fade-up" data-aos-delay="300">
          <button className="cta-primary" onClick={() => navigate('/cars')}>
            View Supercars
          </button>
          <button className="cta-secondary" onClick={() => navigate('/contact')}>
            Book VIP Chauffeur
          </button>
        </div>

        {/* Stats Counter Bar */}
        <div className="hero-stats-bar" data-aos="fade-up" data-aos-delay="400">
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Luxury Supercars</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">10k+</span>
            <span className="stat-label">Satisfied Clients</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">VIP Concierge</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Doorstep Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;


