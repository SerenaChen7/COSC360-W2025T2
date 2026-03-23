import { useEffect, useMemo, useRef, useState } from "react";
import "./SearchableDropdown.css";

export default function SearchableDropdown({
  label,
  helperText,
  name,
  value,
  options,
  placeholder = "Enter your answer",
  onChange,
  rightButton,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const wrapperRef = useRef(null);

  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => a.localeCompare(b));
  }, [options]);

  const filteredOptions = useMemo(() => {
    return sortedOptions.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [sortedOptions, inputValue]);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    onChange({
      target: { name, value: val },
    });

    setIsOpen(true);
  };

  const handleSelect = (option) => {
    setInputValue(option);

    onChange({
      target: { name, value: option },
    });

    setIsOpen(false);
  };

  return (
    <div className="form-group" ref={wrapperRef}>
      {label && <label>{label}</label>}
      {helperText && <p>{helperText}</p>}

      <div className="searchable-dropdown">
        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => !disabled && setIsOpen(true)}
          onClick={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          className={rightButton ? "with-custom-btn" : ""}
        />

        {rightButton ? (
          <div className="dropdown-custom-btn">{rightButton}</div>
        ) : (
          <button
            type="button"
            className="dropdown-arrow-btn"
            onClick={() => !disabled && setIsOpen((prev) => !prev)}
            disabled={disabled}
          >
            ▼
          </button>
        )}

        {isOpen && !disabled && (
          <div className="dropdown-menu">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt}
                  className="dropdown-item"
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </div>
              ))
            ) : (
              <div className="dropdown-no-result">No match</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}