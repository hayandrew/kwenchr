import React from "react";
import "./Ad.css";

export default function Ad({ extClass, width, height }) {
  return (
    <div className={`${extClass || ""} ad-container`}>
      <div
        className="ad-holder"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <div className="ad-inner">
          {width} x {height}
        </div>
      </div>
    </div>
  );
}
