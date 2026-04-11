import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearchChange, onSearchSubmit }) => {
  const [term, setTerm] = useState("");
  const handleSearch = onSearchChange || onSearchSubmit || (() => {});

  return (
    <div className="search-pill">
      <span className="menu-icon">☰</span>
      <input 
        type="text" 
        className="search-input" 
        placeholder="Search courses..." 
        value={term}
        onChange={(e) => {
          const value = e.target.value;
          setTerm(value);
          handleSearch(value);
        }}
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;