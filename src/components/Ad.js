import React from "react";

export default function Ad({ extClass, width, height }) {
  return (
    <div className={`${extClass || ""} ad-container`}>
      <div
        className="ad-holder"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <div className="ad-inner">
          {width} x {height}
        </div>
      </div>
    </div>
  );
}
