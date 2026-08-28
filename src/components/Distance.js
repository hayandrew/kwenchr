"use client";
import React, { useState, useEffect, useRef } from "react";

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
          className="icon icon-map-marker-alt"
          style={{ color: "var(--accent-purple)", fontSize: "14px" }}
        />
        <span>{selectedOption.label}</span>
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
            padding: "8px 0",
            width: "160px",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            animation: "toastSlideDown 0.2s ease-out",
          }}
        >
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setActive(false);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: "8px 16px",
                  fontSize: "13px",
                  color: isSelected ? "white" : "var(--text-secondary)",
                  fontWeight: isSelected ? "600" : "400",
                  cursor: "pointer",
                  backgroundColor: isSelected
                    ? "rgba(255, 255, 255, 0.05)"
                    : "transparent",
                  transition: "background 0.2s, color 0.2s",
                  outline: "none",
                }}
                className="dropdown-item"
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
