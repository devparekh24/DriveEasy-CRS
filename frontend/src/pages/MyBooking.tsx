import React from 'react';
import CommonHeader from '../components/CommonHeader/CommonHeader';
// import SearchFields from '../components/SearchFields/SearchFields';
import MyBooking from '../components/Car/MyBooking/MyBooking';

const CarType: React.FC = () => {
  return (
    <div>
      <CommonHeader heading={'My Bookings'} />
      {/* <SearchFields /> */}
      <MyBooking />
    </div>
  );
};

export default CarType;
