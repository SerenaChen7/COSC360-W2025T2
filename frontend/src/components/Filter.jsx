import { useState, useEffect, useRef } from 'react';
import './Filter.css';

const Filter = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(value === option ? '' : option);
    setOpen(false);
  };

  return (
    <div className="filter-wrapper" ref={ref}>
      <div className="filter-pill" onClick={() => setOpen((o) => !o)}>
        <span className="filter-text">{label}</span>
        {value && <span className="filter-badge">{value}</span>}
        <span className="dropdown-arrow">{open ? '⌃' : '⌄'}</span>
      </div>

      {open && (
        <div className="filter-dropdown">
          {options.map((option) => (
            <div
              key={option}
              className={`filter-option ${value === option ? 'filter-option--selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
