import React from 'react';
import './Hero.css';

interface HeroProps { }

const Hero: React.FC<HeroProps> = () => {

  return (
    <div className="hero-section">
      <h1>Find Best Car & Limousine</h1>
      <h6>From as low as ₹3300 per day with limited time offer discounts</h6>
    </div>
  );
};

export default Hero;
