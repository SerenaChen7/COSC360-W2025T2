import { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
    setValue('');
  };

  return (
    <form className="search-pill" onSubmit={handleSubmit}>
      <span className="menu-icon">☰</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search courses..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="search-icon" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        🔍
      </button>
    </form>
  );
};

export default SearchBar;
