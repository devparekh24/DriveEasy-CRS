import React, { useEffect, useState } from 'react';
import CommonHeader from '../components/CommonHeader/CommonHeader';
import SearchFields from '../components/SearchFields/SearchFields';
import CarsShowcase from '../components/Car/CarShowcase/CarsShowcase';
import GridViewToggle from '../components/Car/GridViewToggle/GridViewToggle';

const Cars: React.FC = () => {

  const [filters, setFilters] = useState({
    sortBy: '',
    transmission: '',
    seatingCapacity: '',
    fuel: '',
    startDate: null,
    endDate: null,
  });

  const [gridView, setGridView] = useState<'1x1' | '2x2' | '3x3'>('3x3');

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleGridViewChange = (view: '1x1' | '2x2' | '3x3') => {
    setGridView(view);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div>
      <CommonHeader heading={'Cars'} />
      <SearchFields onFilterChange={handleFilterChange} />
      <GridViewToggle currentView={gridView} onViewChange={handleGridViewChange} />
      <CarsShowcase filters={filters} gridView={gridView} />
    </div>
  );
};

export default Cars;
