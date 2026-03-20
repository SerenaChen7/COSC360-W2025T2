import './SearchBar.css';

const SearchBar = ({ onSearchChange }) => {
  return (
    <div className="search-pill">
      <span className="menu-icon">☰</span>
      <input 
        type="text" 
        className="search-input" 
        placeholder="Hinted search text" 
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;