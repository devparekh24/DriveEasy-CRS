import React from 'react';
import { MdOutlineExpandMore } from 'react-icons/md';
import { BsArrowDownUp } from 'react-icons/bs';
import '../styles/Hero.css';

interface HeroProps { }

const Hero: React.FC<HeroProps> = () => {
  const function_1 = () => {
    const dropdown = document.getElementById('myDropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  };

  const function_2 = () => {
    const dropdown = document.getElementById('myDropdown2');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  };

  const function_3 = () => {
    const dropdown = document.getElementById('myDropdown3');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  };

  return (
    <div className="hero-section">
      <h1>Find Best Car & Limousine</h1>
      <h6>From as low as $10 per day with limited time offer discounts</h6>
      <div className="search-fields">
        <div className="search-col">
          <div className="dropdown">
            <button className="dropbtn" onClick={function_1}>
              Any Brand
              <MdOutlineExpandMore />
            </button>
            <div id="myDropdown" className="dropdown-content">
              <a href="#">Any Brand</a>
              <a href="#">Audi</a>
              <a href="#">BMW</a>
              <a href="#">Lexus</a>
              <a href="#">Mercedes Benz</a>
              <a href="#">MINI</a>
              <a href="#">Porsche</a>
            </div>
          </div>
        </div>
        <div className="search-col">
          <div className="dropdown">
            <button className="dropbtn" onClick={function_2}>
              Any Type
              <MdOutlineExpandMore />
            </button>
            <div id="myDropdown2" className="dropdown-content">
              <a href="#">Any Type</a>
              <a href="#">Coupe</a>
              <a href="#">Sedan</a>
              <a href="#">SUV</a>
            </div>
          </div>
        </div>
        <div className="search-col">
          <div className="dropdown">
            <button className="dropbtn" onClick={function_3}>
              Price Low to High
              <BsArrowDownUp />
            </button>
            <div id="myDropdown3" className="dropdown-content">
              <a href="#">Price Low to High</a>
              <a href="#">Price High to Low</a>
              <a href="#">Sort By Popularity</a>
              <a href="#">Sort By Review Score</a>
            </div>
          </div>
        </div>
        <div className="search-col">
          <button className="search-btn">Search</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
