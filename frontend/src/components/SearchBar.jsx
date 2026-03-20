import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearchSubmit }) => {
  const [term, setTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the term to the parent component's fetch function
    onSearchSubmit(term); 
    // Requirement: Clear the search box after submission 
    setTerm(""); 
  };

  return (
    <form className="search-pill" onSubmit={handleSubmit}>
      <span className="menu-icon">☰</span>
      <input 
        type="text" 
        className="search-input" 
        placeholder="Search courses..." 
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <span className="search-icon">🔍</span>
      </button>
    </form>
  );
};

export default SearchBar;