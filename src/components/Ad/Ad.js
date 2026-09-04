import React from "react";
import "./Ad.css";

export default function Ad({ extClass, width, height, responsive }) {
  const isResponsive = responsive || width === "100%" || width === "responsive";
  const widthStyle = isResponsive ? "100%" : `${width}px`;
  const heightStyle = `${height}px`;

  return (
    <div
      className={`${extClass || ""} ad-container ${isResponsive ? "ad-responsive" : ""}`.trim()}
    >
      <div
        className="ad-holder"
        style={{
          width: widthStyle,
          height: heightStyle,
        }}
      >
        <div className="ad-inner">
          {isResponsive ? "Responsive Ad" : `${width} x ${height}`}
        </div>
      </div>
    </div>
  );
}
