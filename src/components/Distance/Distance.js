"use client";
import React, { useState, useEffect, useRef } from "react";
import "./Distance.css";

export default function Distance({ value, onChange }) {
  const [active, setActive] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: "all", label: "Closest" },
    { value: "0.5", label: "0.5 miles" },
    { value: "1", label: "1 mile" },
    { value: "2", label: "2 miles" },
    { value: "5", label: "5 miles" },
  ];

  // Auto-close when clicking outside of the dropdown panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActive(false);
      }
    };
    if (active) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [active]);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="category-filter-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="distance-trigger-btn"
        aria-label={selectedOption.label}
        title={selectedOption.label}
        onClick={() => setActive(!active)}
      >
        <i className="icon icon-map-marker-alt distance-icon" />
        {/* <span>{selectedOption.label}</span> */}
        <i className="icon icon-chevron-down distance-chevron" />
      </button>

      {active && (
        <div className="filters-dropdown-content">
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setActive(false);
                }}
                className={`dropdown-item ${isSelected ? "is-selected" : ""}`.trim()}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
