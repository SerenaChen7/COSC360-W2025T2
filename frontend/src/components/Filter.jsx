import './Filter.css';

const Filter = ({ label, count }) => {
  return (
    <div className="filter-pill">
      <span className="filter-text">{label}</span>
      <span className="filter-badge">{count}</span>
      <span className="dropdown-arrow">⌄</span>
    </div>
  );
};

export default Filter;