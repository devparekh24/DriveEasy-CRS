import React from 'react';
import { useParams } from 'react-router-dom';

const CarDetails: React.FC = () => {
  const params = useParams();

  return (
    <div>
      <h2>Car Details {params.id}</h2>
    </div>
  );
};

export default CarDetails;
