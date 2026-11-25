import React, { useEffect } from 'react';
import CarInfo from '../components/Car/CarInfo/CarInfo';
import { isV2Enabled } from '../utils/featureFlags';

const CarInfoPage: React.FC = () => {
  const v2Active = isV2Enabled();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <div className={v2Active ? "v2-carinfo-theme" : ""}>
      <CarInfo />
    </div>
  );
};

export default CarInfoPage;

