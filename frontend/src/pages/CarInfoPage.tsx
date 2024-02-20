import React, { useEffect } from 'react';
// import CarCarousel from '../components/CarCarousel';
import CarInfo from '../components/Car/CarInfo/CarInfo';

// const slideImages = [
//   {
//     url: "https://images.unsplash.com/photo-1597007030739-6d2e7172ee5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
//     caption: "Slide 1",
//   },
//   {
//     url: "https://images.unsplash.com/photo-1597007029837-50500644a1d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
//     caption: "Slide 2",
//   },
//   {
//     url: "https://images.unsplash.com/photo-1606224103857-e4c74b0139df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
//     caption: "Slide 3",
//   },
// ];

const CarInfoPage: React.FC = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <div>
      {/* <CarCarousel slideImages={slideImages} /> */}
      <CarInfo />
    </div>
  );
};

export default CarInfoPage;
