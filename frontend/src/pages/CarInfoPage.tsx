import React, { useEffect } from 'react';
import CarInfo from '../components/Car/CarInfo/CarInfo';

const CarInfoPage: React.FC = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <div>
      <CarInfo />
    </div>
  );
};

export default CarInfoPage;
