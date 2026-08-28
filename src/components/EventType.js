"use client";
import React, { useState, useEffect, useRef } from "react";

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
      className="category-filter-dropdown"
      ref={dropdownRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      <button
        onClick={() => setActive(!active)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid var(--border-color)",
          color: "var(--text-primary)",
          fontSize: "13px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s",
          outline: "none",
        }}
      >
        <i
          className="icon icon-filter"
          style={{ color: "var(--accent-purple)", fontSize: "14px" }}
        />
        <span>{selectedLabel}</span>
        <i
          className="icon icon-chevron-down"
          style={{ fontSize: "10px", opacity: 0.7, marginLeft: "4px" }}
        />
      </button>

      {active && (
        <div
          className="filters-dropdown-content"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            boxShadow: "var(--shadow-lg)",
            padding: "16px",
            width: "200px",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            animation: "toastSlideDown 0.2s ease-out",
          }}
        >
          {options.map((opt) => {
            const isChecked = value.includes(opt.value);
            return (
              <label
                key={opt.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13px",
                  color: isChecked ? "white" : "var(--text-secondary)",
                  fontWeight: isChecked ? "600" : "400",
                  cursor: "pointer",
                  userSelect: "none",
                  transition: "color 0.2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    handleCheckboxChange(opt.value, e.target.checked)
                  }
                  style={{
                    accentColor: "var(--accent-purple)",
                    cursor: "pointer",
                    width: "15px",
                    height: "15px",
                  }}
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
