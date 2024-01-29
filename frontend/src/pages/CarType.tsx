import React from 'react';
import CommonHeader from '../components/CommonHeader';
// import SearchFields from '../components/SearchFields';
import CarTypeList from '../components/CarTypeList';

const CarType: React.FC = () => {
  return (
    <div>
      <CommonHeader heading={'Car Type'} />
      {/* <SearchFields /> */}
      <CarTypeList />
    </div>
  );
};

export default CarType;
