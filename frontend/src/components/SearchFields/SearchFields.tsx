import React from 'react';
import './SearchFields.css';

const SearchFields: React.FC = () => {
  return (
    <div className="search-fields">
      <div className="search-fields-container">
        <div className="search-field-col">
          <select className="select-field">
            <option value="someOption">Some option</option>
            <option value="otherOption">Other option</option>
          </select>
        </div>
        <div className="search-field-col">
          <select className="select-field">
            <option value="someOption">Others</option>
            <option value="otherOption">Other option</option>
          </select>
        </div>
        <div className="search-field-col">
          <select className="select-field">
            <option value="someOption">Price Low to High</option>
            <option value="otherOption">Other option</option>
          </select>
        </div>
        <div className="search-field-col">
          <button className="search-btn btn-search">Search</button>
        </div>
      </div>
    </div>
  );
};

export default SearchFields;
