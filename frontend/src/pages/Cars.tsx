import React from 'react';
import CommonHeader from '../components/CommonHeader/CommonHeader';
// import SearchFields from '../components/SearchFields';
import CarsShowcase from '../components/Car/CarShowcase/CarsShowcase';

const Cars: React.FC = () => {
  return (
    <div>
      <CommonHeader heading={'Cars'} />
      {/* <SearchFields /> */}
      <CarsShowcase />
    </div>
  );
};

export default Cars;
