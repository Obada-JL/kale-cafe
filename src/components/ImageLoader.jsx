import React from "react";
import "./ImageLoader.css";

export const ImageLoader = () => (
  <>
    <div className="image-loader-container">
      <div className="coffee-cup">
        <div className="coffee-container">
          <div className="coffee"></div>
        </div>
        <div className="cup-handle"></div>
      </div>
      <div className="loading-text">جاري التحميل...</div>
    </div>
    <div className="image-loader-container">
      <div className="coffee-cup">
        <div className="coffee-container">
          <div className="coffee"></div>
        </div>
        <div className="cup-handle"></div>
      </div>
      <div className="loading-text">جاري التحميل...</div>
    </div>
  </>
);
