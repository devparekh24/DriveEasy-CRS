import { useState } from 'react';
import './SearchFields.css';
import { LuFilterX } from 'react-icons/lu';

const SearchFields = ({ onFilterChange }: { onFilterChange: (filters: any) => void }) => {

  const [selectedFilters, setSelectedFilters] = useState({
    sortBy: '',
    transmission: '',
    seatingCapacity: '',
    fuel: '',
  });

  const handleFilterChange = (filterType: string, value: any) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const handleSearch = () => {
    // Pass the selected filters to the parent component
    onFilterChange(selectedFilters);
  };

  return (
    <div className="search-fields">
      <div className="search-fields-container">

        {/* sortBy */}
        <div className="search-field-col">
          <select className="select-field"
            value={selectedFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}>
            <option>Select Price High To Low</option>
            <option value="dailyPriceHighToLow">Daily Price High To Low</option>
            <option value="dailyPriceLowToHigh">Daily Price Low To High</option>
            <option value="hourlyPriceHighToLow">Hourly Price High To Low</option>
            <option value="hourlyPriceLowToHigh">Hourly Price Low To High</option>
            <option value="perKMPriceHighToLow">Per KM Price High To Low</option>
            <option value="perKMPriceLowToHigh">Per KM Price Low To High</option>
          </select>
        </div>

        {/* transmission */}
        <div className="search-field-col">
          <select className="select-field"
            value={selectedFilters.transmission}
            onChange={(e) => handleFilterChange('transmission', e.target.value)}>
            <option>Select Transmission</option>
            <option value="manual">Manual Transmission (MT)</option>
            <option value="automatic">Automatic Transmission (AT)</option>
            <option value="am">Automated Manual Transmission (AM)</option>
            <option value="cv">Continuously Variable Transmission (CVT)</option>
          </select>
        </div>

        {/* Fuel */}
        <div className="search-field-col">
          <select className="select-field"
            value={selectedFilters.fuel}
            onChange={(e) => handleFilterChange('fuel', e.target.value)}>
            <option>Select Fuel Type</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="cng">CNG</option>
            <option value="ev">EV</option>
          </select>
        </div>

        {/* seatingCapacity */}
        <div className="search-field-col">
          <select className="select-field"
            value={selectedFilters.seatingCapacity}
            onChange={(e) => handleFilterChange('seatingCapacity', e.target.value)}>
            <option>Select Seating Capacity</option>
            <option value="gt5">{' > 5'}</option>
            <option value="lteq5">{' <= 5'}</option>
          </select>
        </div>

        <div className="search-field-col">
          <button className="filter-btn" onClick={handleSearch}>Search</button>
          <LuFilterX style={{ marginLeft: 15, fontSize: 35, cursor: 'pointer' }} onClick={() => setSelectedFilters(
            {
              sortBy: '',
              transmission: '',
              fuel: '',
              seatingCapacity: '',
            })} />
        </div>
      </div>
    </div>
  );
};

export default SearchFields;
