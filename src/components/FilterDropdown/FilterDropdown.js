"use client";
import React, { useState, useEffect, useRef } from "react";
import "./FilterDropdown.css";

const EVENT_TYPE_OPTIONS = [
  { value: "happy-hour", label: "Happy Hour" },
  { value: "comedy", label: "Comedy" },
  { value: "event", label: "Special Event" },
  { value: "lgbt", label: "LGBT+" },
];

const DISTANCE_OPTIONS = [
  { value: "all", label: "Closest" },
  { value: "0.5", label: "0.5 miles" },
  { value: "1", label: "1 mile" },
  { value: "2", label: "2 miles" },
  { value: "5", label: "5 miles" },
];

export default function FilterDropdown({
  eventType = [],
  onTypeChange,
  distance = "all",
  onDistanceChange,
}) {
  const [active, setActive] = useState(false);
  const dropdownRef = useRef(null);

  const handleCheckboxChange = (optionValue, checked) => {
    let updatedValues;
    if (checked) {
      updatedValues = [...eventType, optionValue];
    } else {
      updatedValues = eventType.filter((v) => v !== optionValue);
    }
    if (onTypeChange) {
      onTypeChange(updatedValues);
    }
  };

  const handleDistanceChange = (val) => {
    if (onDistanceChange) {
      onDistanceChange(val);
    }
  };

  // Close when clicking outside
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

  const hasActiveFilters =
    (eventType && eventType.length > 0) || (distance && distance !== "all");

  return (
    <div className="filter-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className={`filter-trigger-btn ${active ? "is-active" : ""} ${hasActiveFilters ? "has-filters" : ""}`.trim()}
        aria-label="Filters"
        title="Filters"
        data-testid="filter-dropdown-trigger"
        onClick={() => setActive(!active)}
      >
        <i className="icon icon-filter filter-icon" />
        <i className={`icon icon-chevron-down filter-chevron ${active ? "is-open" : ""}`.trim()} />
        {hasActiveFilters && <span className="filter-active-dot" />}
      </button>

      {active && (
        <div
          className="filter-dropdown-menu"
          role="dialog"
          aria-label="Filter options"
          data-testid="filter-dropdown-menu"
        >
          {/* Event Types Section */}
          <div className="filter-section">
            <div className="filter-section-header">Event Types</div>
            <div className="filter-options-group">
              {EVENT_TYPE_OPTIONS.map((opt) => {
                const isChecked = eventType.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className={`filter-option-label ${isChecked ? "is-checked" : ""}`.trim()}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        handleCheckboxChange(opt.value, e.target.checked)
                      }
                      className="filter-checkbox"
                    />
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="filter-divider" />

          {/* Distance Section */}
          <div className="filter-section">
            <div className="filter-section-header">Distance</div>
            <div className="filter-options-group">
              {DISTANCE_OPTIONS.map((opt) => {
                const isSelected = distance === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`filter-option-label ${isSelected ? "is-selected" : ""}`.trim()}
                  >
                    <input
                      type="radio"
                      name="filter-distance-radio"
                      value={opt.value}
                      checked={isSelected}
                      onChange={() => handleDistanceChange(opt.value)}
                      className="filter-radio"
                    />
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="filter-divider" />

          {/* Done Button */}
          <div className="filter-actions">
            <button
              type="button"
              className="btn btn-primary filter-done-btn"
              data-testid="filter-done-button"
              onClick={() => setActive(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
