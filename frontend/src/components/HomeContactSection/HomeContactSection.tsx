import React from 'react';
import './HomeContactSection.css';
import { IoCarSportOutline } from 'react-icons/io5';
import { FaRegGrinHearts, FaRegHeart } from 'react-icons/fa';

const HomeContactSection: React.FC = () => {
  return (
    <>
      <div className="HomeContactSection">
        <h2>Our Fleet, Your Fleet</h2>
        <h6>
          We know the difference is in the details and that’s why our car rental
          services, in the tourism and business industry, stand out for their
          quality and good taste, to offer you a unique experience
        </h6>
        <p>Call Now (+91) 12345-67890</p>
        <button className="call-btn">Request a Quote</button>
      </div>
      <div className="why-choose-us">
        <h1>Why Choose Us</h1>
        <h6>Explore our first-class car rental services</h6>
        <div className="choose-us-container">
          <div className="choose-us-child">
            <IoCarSportOutline className="icon" />
            <h3>Variety of Car Brands</h3>
            <p>
              Discover an extensive range of top-tier car brands that cater to diverse preferences and styles. From iconic luxury manufacturers to reliable everyday vehicles, our selection ensures you find the perfect match for your driving needs.
            </p>
          </div>
          <div className="choose-us-child">
            <FaRegGrinHearts className="icon" />
            <h3>Best Rate Guarantee</h3>
            <p>
              Rest easy with our commitment to providing you the best rates in the market. We guarantee competitive pricing, ensuring you get exceptional value for your investment. Drive with confidence knowing you've secured the most favorable deal.
            </p>
          </div>
          <div className="choose-us-child">
            <FaRegHeart className="icon" />
            <h3>Awesome Customer Support</h3>
            <p>
              Experience unparalleled customer support that goes beyond expectations. Our dedicated team is ready to assist you at every step, ensuring a seamless and enjoyable journey. Trust us to prioritize your satisfaction and address your needs promptly and effectively.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeContactSection;
