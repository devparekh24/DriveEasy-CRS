import React from 'react';
import Hero from '../components/Hero';
import CarList from '../components/CarList';
import HomeContactSection from '../components/HomeContactSection';
import HowItWorks from '../components/HowItWorks';

const Home: React.FC = () => {
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
