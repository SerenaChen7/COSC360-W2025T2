import { useState, useRef, useEffect } from 'react';
import './Filter.css';

const Filter = ({ label, options = [], selectedValues = [], onChange, singleSelect = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    if (singleSelect) {
      onChange(selectedValues[0] === value ? [] : [value]);
      setIsOpen(false);
    } else {
      if (selectedValues.includes(value)) {
        onChange(selectedValues.filter((v) => v !== value));
      } else {
        onChange([...selectedValues, value]);
      }
    }
  };

  const count = selectedValues.length;

  return (
    <div className="filter-container" ref={containerRef}>
      <div
        className={`filter-pill${isOpen ? ' filter-pill--open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="filter-text">{label}</span>
        {count > 0 && <span className="filter-badge">{count}</span>}
        <span className={`dropdown-arrow${isOpen ? ' dropdown-arrow--up' : ''}`}>⌄</span>
      </div>

      {isOpen && (
        <div className="filter-dropdown">
          {options.map((opt) => {
            const isSelected = selectedValues.includes(opt.value);
            return (
              <div
                key={opt.value}
                className={`filter-option${isSelected ? ' filter-option--selected' : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                {!singleSelect && (
                  <span className="filter-option-check">{isSelected ? '✓' : ''}</span>
                )}
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Filter;
