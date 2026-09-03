"use client";
import React, { useState, useEffect, useRef } from "react";
import "./Places.css";

export default function Places({ onLocationChange }) {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [confirmedAddress, setConfirmedAddress] = useState("");
  const [placeholder, setPlaceholder] = useState("Choose Location...");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkLocationStorage = () => {
      if (typeof window !== "undefined") {
        const cachedStr = sessionStorage.getItem("kwenchr_location");
        if (cachedStr) {
          try {
            const cached = JSON.parse(cachedStr);
            if (cached.isCurrentLocation) {
              setPlaceholder("Current Location");
              return;
            } else if (cached.address) {
              setAddress(cached.address);
              setConfirmedAddress(cached.address);
            }
          } catch (e) {}
        }
        setPlaceholder("Choose Location...");
      }
    };

    checkLocationStorage();

    window.addEventListener("storage", checkLocationStorage);
    window.addEventListener("locationChange", checkLocationStorage);
    return () => {
      window.removeEventListener("storage", checkLocationStorage);
      window.removeEventListener("locationChange", checkLocationStorage);
    };
  }, []);

  // Close suggestions dropdown when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle typing input and fetch suggestions natively
  const handleChange = async (e) => {
    const value = e.target.value;
    setAddress(value);
    setCoordinates({ lat: null, lng: null });
    setErrorMessage("");

    if (value.length <= 2) {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
      return;
    }

    if (typeof window !== "undefined" && window.google && window.google.maps) {
      try {
        let AutocompleteSuggestion;
        if (
          window.google.maps.places &&
          window.google.maps.places.AutocompleteSuggestion
        ) {
          AutocompleteSuggestion =
            window.google.maps.places.AutocompleteSuggestion;
        } else {
          // Import new places library dynamically if not yet fully loaded
          const library = await window.google.maps.importLibrary("places");
          AutocompleteSuggestion = library.AutocompleteSuggestion;
        }

        // Fetch suggestions restricted to US cities
        const response =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: value,
            includedRegionCodes: ["US"],
            includedPrimaryTypes: ["(cities)"],
          });

        if (response && response.suggestions) {
          setSuggestions(response.suggestions);
          setActiveSuggestionIndex(-1);
        } else {
          setSuggestions([]);
          setActiveSuggestionIndex(-1);
        }
      } catch (err) {
        console.error("Error fetching autocomplete suggestions:", err);
        setSuggestions([]);
        setActiveSuggestionIndex(-1);
      }
    }
  };

  const handleUseCurrentLocation = () => {
    setSuggestions([]);
    setAddress("");
    setConfirmedAddress("");
    setPlaceholder("Current Location");
    setIsFocused(false);
    if (typeof document !== "undefined" && document.activeElement) {
      document.activeElement.blur();
    }

    if (typeof window !== "undefined" && navigator.geolocation) {
      setIsGeocoding(true);
      setErrorMessage("");

      const geoSuccess = (position) => {
        setIsGeocoding(false);
        const cachedData = {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          isCurrentLocation: true,
          timestamp: Date.now(),
        };
        sessionStorage.setItem("kwenchr_location", JSON.stringify(cachedData));
        window.dispatchEvent(new Event("locationChange"));

        if (onLocationChange) {
          onLocationChange({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        }
      };

      const geoError = (error) => {
        setIsGeocoding(false);
        console.warn("Geolocation Error:", error);
        setErrorMessage("Failed to retrieve current location.");
      };

      navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {
        maximumAge: 5 * 60 * 1000,
      });
    } else {
      setErrorMessage("Geolocation not supported by browser.");
    }
  };

  // Handle suggestion select and perform geocoding natively via Google Maps Geocoder
  const handleSelect = async (suggestion) => {
    const selectedText =
      suggestion.placePrediction.text.toString() ||
      suggestion.placePrediction.text;
    setAddress(selectedText);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    setIsGeocoding(true);

    try {
      if (
        typeof window !== "undefined" &&
        window.google &&
        window.google.maps
      ) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: selectedText }, (results, status) => {
          setIsGeocoding(false);
          if (status === "OK" && results[0]) {
            const newLat = results[0].geometry.location.lat();
            const newLng = results[0].geometry.location.lng();
            setCoordinates({ lat: newLat, lng: newLng });

            const cachedData = {
              address: selectedText,
              coords: {
                latitude: newLat,
                longitude: newLng,
                accuracy: 1,
              },
              isCurrentLocation: false,
              timestamp: Date.now(),
            };
            sessionStorage.setItem(
              "kwenchr_location",
              JSON.stringify(cachedData),
            );
            setConfirmedAddress(selectedText);
            window.dispatchEvent(new Event("locationChange"));

            if (onLocationChange) {
              onLocationChange({ lat: newLat, lng: newLng });
            }
          } else {
            setErrorMessage("Geocoding failed: " + status);
          }
        });
      }
    } catch (err) {
      setIsGeocoding(false);
      setErrorMessage(err.message);
    }
  };

  const handleKeyDown = (e) => {
    const totalItems = suggestions.length + 1;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= totalItems ? 0 : nextIndex;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prevIndex) => {
        const nextIndex = prevIndex - 1;
        return nextIndex < 0 ? totalItems - 1 : nextIndex;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestionIndex === 0) {
        handleUseCurrentLocation();
      } else if (
        activeSuggestionIndex > 0 &&
        activeSuggestionIndex < totalItems
      ) {
        handleSelect(suggestions[activeSuggestionIndex - 1]);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleCloseClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleUseCurrentLocation();
  };

  return (
    <div className="places-wrapper" ref={dropdownRef}>
      <div className="search-bar-container">
        <div className="input-wrapper search-input-container">
          <input
            type="text"
            value={address}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isFocused ? "" : placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="search-input"
          />
          {address.length > 0 && (
            <button
              type="button"
              className="clear-button"
              onClick={handleCloseClick}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="Clear location search"
            >
              <i className="icon icon-close" />
            </button>
          )}
        </div>

        {isFocused && (suggestions.length > 0 || address.length === 0) && (
          <div className="autocomplete-container">
            {/* Permanent "Use Current Location" option */}
            <div
              className={`suggestion-item current-location-option ${activeSuggestionIndex === 0 ? "suggestion-item--active" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleUseCurrentLocation();
              }}
              onMouseEnter={() => setActiveSuggestionIndex(0)}
            >
              <i className="icon icon-map-marker-alt location-icon" />
              <span>Use Current Location</span>
            </div>

            {suggestions.map((suggestion, index) => {
              const mainText =
                suggestion.placePrediction.mainText.toString() ||
                suggestion.placePrediction.mainText;
              const secondaryText =
                suggestion.placePrediction.secondaryText.toString() ||
                suggestion.placePrediction.secondaryText;

              const isActive = index + 1 === activeSuggestionIndex;
              return (
                <div
                  key={suggestion.placePrediction.placeId || index}
                  className={`suggestion-item ${isActive ? "suggestion-item--active" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(suggestion);
                  }}
                  onMouseEnter={() => setActiveSuggestionIndex(index + 1)}
                >
                  <strong>{mainText}</strong>{" "}
                  <small className="suggestion-secondary-text">
                    {secondaryText}
                  </small>
                </div>
              );
            })}
            <div className="dropdown-footer">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/powered_by_google_default.png"
                  alt="Powered by Google"
                  className="dropdown-footer-image"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {errorMessage.length > 0 && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
