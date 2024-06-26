import React, { useEffect, useState } from 'react';
import CommonHeader from '../components/CommonHeader/CommonHeader';
import SearchFields from '../components/SearchFields/SearchFields';
import CarsShowcase from '../components/Car/CarShowcase/CarsShowcase';

const Cars: React.FC = () => {

  const [filters, setFilters] = useState({
    sortBy: '',
    transmission: '',
    seatingCapacity: '',
    fuel: '',
    startDate: null,
    endDate: null,
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div>
      <CommonHeader heading={'Cars'} />
      <SearchFields onFilterChange={handleFilterChange} />
      <CarsShowcase filters={filters} />
    </div>
  );
};

export default Cars;
