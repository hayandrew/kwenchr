"use client";
import React, { useState, useEffect, useRef } from "react";
import "./EventType.css";

export default function EventType({ value = [], onChange }) {
  const [active, setActive] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: "happy-hour", label: "Happy Hour" },
    { value: "comedy", label: "Comedy" },
    { value: "event", label: "Special Event" },
    { value: "lgbt", label: "LGBT+" },
  ];

  const handleCheckboxChange = (optionValue, checked) => {
    let updatedValues;
    if (checked) {
      updatedValues = [...value, optionValue];
    } else {
      updatedValues = value.filter((v) => v !== optionValue);
    }
    onChange(updatedValues);
  };

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

  // Dynamic counter label display
  const selectedLabel =
    value.length === 0
      ? "Event Types"
      : `${value.length} Type${value.length > 1 ? "s" : ""} Selected`;

  return (
    <div
      className="category-filter-dropdown event-type-dropdown"
      ref={dropdownRef}
    >
      <button
        type="button"
        className="event-type-trigger-btn"
        aria-label={selectedLabel}
        title={selectedLabel}
        onClick={() => setActive(!active)}
      >
        <i className="icon icon-filter event-type-icon" />
        {/* <span>{selectedLabel}</span> */}
        <i className="icon icon-chevron-down event-type-chevron" />
      </button>

      {active && (
        <div className="filters-dropdown-content event-type-dropdown-content">
          {options.map((opt) => {
            const isChecked = value.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={`event-type-option ${isChecked ? "is-checked" : ""}`.trim()}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    handleCheckboxChange(opt.value, e.target.checked)
                  }
                  className="event-type-checkbox"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
