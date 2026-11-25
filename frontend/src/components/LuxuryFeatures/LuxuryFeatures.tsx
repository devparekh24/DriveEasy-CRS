import React from 'react';
import './LuxuryFeatures.css';
import { FaUserSecret, FaKey, FaShieldAlt, FaHeadset, FaCrown } from 'react-icons/fa';

const LuxuryFeatures: React.FC = () => {
  const features = [
    {
      icon: <FaUserSecret className="feature-icon" />,
      title: "VIP Chauffeur Service",
      description: "Enjoy your journey from the luxury back seat with our certified white-glove professional chauffeurs."
    },
    {
      icon: <FaKey className="feature-icon" />,
      title: "Doorstep Key Handover",
      description: "Direct vehicle delivery to your residence, hotel lobby, or private airport hangar anywhere across the city."
    },
    {
      icon: <FaShieldAlt className="feature-icon" />,
      title: "Zero Security Deposit Options",
      description: "Hassle-free luxury rentals with instant digital verification and zero security hold options for elite members."
    },
    {
      icon: <FaHeadset className="feature-icon" />,
      title: "24/7 Dedicated VIP Concierge",
      description: "Personal concierge available round the clock for route assistance, luxury dining, and emergency support."
    }
  ];

  return (
    <div className="luxury-features-section">
      <div className="features-container">
        <div className="features-header" data-aos="fade-up">
          <div className="crown-badge">
            <FaCrown className="crown-icon" />
            <span>UNMATCHED PRIVILEGES</span>
          </div>
          <h2 className="features-title">
            WHY DRIVE EASY <span className="gold-text">ROYALTY</span>
          </h2>
          <p className="features-subtitle">
            Redefining luxury car rentals with bespoke services tailored for discerning travelers
          </p>
        </div>

        <div className="features-grid" data-aos="fade-up" data-aos-delay="150">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon-box">
                {feature.icon}
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LuxuryFeatures;
