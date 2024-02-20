import React, { useEffect } from 'react';
import CommonHeader from '../components/CommonHeader/CommonHeader';
// import SearchFields from '../components/SearchFields/SearchFields';
import MyBooking from '../components/Car/MyBooking/MyBooking';

const MyBookingPage: React.FC = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div>
      <CommonHeader heading={'My Bookings'} />
      {/* <SearchFields /> */}
      <MyBooking />
    </div>
  );
};

export default MyBookingPage;
