import React, { useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import CarList from '../components/Car/CarList/CarList';
import HomeContactSection from '../components/HomeContactSection/HomeContactSection';
import HowItWorks from '../components/HowItWorks/HowItWorks';

const Home: React.FC = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div>
      <Hero />
      <HowItWorks />
      <CarList />
      <HomeContactSection />
    </div>
  );
};

export default Home;
