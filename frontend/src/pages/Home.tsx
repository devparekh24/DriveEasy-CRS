import React, { useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import CarList from '../components/Car/CarList/CarList';
import HomeContactSection from '../components/HomeContactSection/HomeContactSection';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import LuxuryFeatures from '../components/LuxuryFeatures/LuxuryFeatures';
import { isV2Enabled } from '../utils/featureFlags';

const Home: React.FC = () => {
  const v2Active = isV2Enabled();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="home-page-container" style={{ background: v2Active ? '#080a0f' : '#ffffff', minHeight: '100vh' }}>
      <Hero />
      <HowItWorks />
      {v2Active && <LuxuryFeatures />}
      <CarList />
      <HomeContactSection />
    </div>
  );
};

export default Home;


