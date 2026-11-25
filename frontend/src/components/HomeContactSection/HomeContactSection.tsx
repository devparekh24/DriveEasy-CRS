import React from 'react';
import './HomeContactSection.css';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaCrown, FaArrowRight, FaRegGrinHearts, FaRegHeart } from 'react-icons/fa';
import { IoCarSportOutline } from 'react-icons/io5';
import { isV2Enabled } from '../../utils/featureFlags';

const HomeContactSection: React.FC = () => {
  const navigate = useNavigate();
  const v2Active = isV2Enabled();

  // V1 Classic Home Contact & Why Choose Us Section
  if (!v2Active) {
    return (
      <>
        <div className="v1-HomeContactSection">
          <h2>Our Fleet, Your Fleet</h2>
          <h6>
            We know the difference is in the details and that’s why our car rental
            services, in the tourism and business industry, stand out for their
            quality and good taste, to offer you a unique experience
          </h6>
          <p>Call Now (+91) 12345-67890</p>
          <button className="call-btn" onClick={() => navigate('/contact')}>Request a Quote</button>
        </div>
        <div className="v1-why-choose-us">
          <h1>Why Choose Us</h1>
          <h6>Explore our first-class car rental services</h6>
          <div className="v1-choose-us-container">
            <div className="v1-choose-us-child">
              <IoCarSportOutline className="icon" />
              <h3>Variety of Car Brands</h3>
              <p>
                Discover an extensive range of top-tier car brands that cater to diverse preferences and styles. From iconic luxury manufacturers to reliable everyday vehicles, our selection ensures you find the perfect match for your driving needs.
              </p>
            </div>
            <div className="v1-choose-us-child">
              <FaRegGrinHearts className="icon" />
              <h3>Best Rate Guarantee</h3>
              <p>
                Rest easy with our commitment to providing you the best rates in the market. We guarantee competitive pricing, ensuring you get exceptional value for your investment. Drive with confidence knowing you've secured the most favorable deal.
              </p>
            </div>
            <div className="v1-choose-us-child">
              <FaRegHeart className="icon" />
              <h3>Awesome Customer Support</h3>
              <p>
                Experience unparalleled customer support that exceeds expectations. Our dedicated team is ready to assist you at every step, ensuring a seamless and enjoyable journey with prompt and effective solutions.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // V2 Luxury VIP Concierge Contact View
  return (
    <div className="home-vip-contact-wrapper">
      <div className="vip-contact-container" data-aos="zoom-in">
        <div className="vip-glass-card">
          <div className="vip-badge">
            <FaCrown className="badge-crown" />
            <span>24/7 VIP CONCIERGE</span>
          </div>

          <h2 className="vip-title">
            READY TO EXPERIENCE <span className="gold-text">ROYALTY ON WHEELS?</span>
          </h2>

          <p className="vip-desc">
            Our luxury vehicle specialists are available around the clock to reserve your vehicle, 
            arrange private chauffeur services, or organize airport concierge drop-offs.
          </p>

          <div className="vip-hotlines-row">
            <a href="tel:+911234567890" className="hotline-box">
              <FaPhoneAlt className="hotline-icon" />
              <div>
                <span className="hotline-label">Direct VIP Line</span>
                <span className="hotline-val">+91 12345-67890</span>
              </div>
            </a>

            <a href="mailto:concierge@driveeasy.com" className="hotline-box">
              <FaEnvelope className="hotline-icon" />
              <div>
                <span className="hotline-label">Concierge Email</span>
                <span className="hotline-val">concierge@driveeasy.com</span>
              </div>
            </a>
          </div>

          <div className="vip-actions">
            <button className="vip-primary-btn" onClick={() => navigate('/contact')}>
              <span>Request VIP Callback</span>
              <FaArrowRight />
            </button>
            <button className="vip-secondary-btn" onClick={() => navigate('/cars')}>
              <span>Browse Supercars</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContactSection;


