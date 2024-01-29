import React from 'react';
import Hero from '../components/Hero/Hero';
import CarList from '../components/Car/CarList/CarList';
import HomeContactSection from '../components/HomeContactSection/HomeContactSection';
import HowItWorks from '../components/HowItWorks/HowItWorks';

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
