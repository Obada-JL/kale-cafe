import React from "react";
import "./ProductLoader.css";

export const ProductLoader = () => (
  <tr>
    <td className="w-50">
      <div className="menu-item-loader">
        <div className="plate-shimmer">
          <div className="plate">
            <div className="steam">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="details">
            <div className="text-line"></div>
            <div className="price-box">
              <span className="currency">TL</span>
            </div>
          </div>
        </div>
      </div>
    </td>
    <td className="w-50">
      <div className="menu-item-loader">
        <div className="plate-shimmer">
          <div className="plate">
            <div className="steam">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="details">
            <div className="text-line"></div>
            <div className="price-box">
              <span className="currency">TL</span>
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
);

export default ProductLoader;
