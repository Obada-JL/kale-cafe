import React from "react";

export const ProductSkeleton = () => (
  <tr>
    <td className="w-50">
      <div className="product-container skeleton-loading">
        <div className="product-name skeleton"></div>
        <div className="product-price skeleton"></div>
      </div>
    </td>
    <td className="w-50">
      <div className="product-container skeleton-loading">
        <div className="product-name skeleton"></div>
        <div className="product-price skeleton"></div>
      </div>
    </td>
  </tr>
);

export const ImageSkeleton = () => (
  <div className="sliderProduct scroll-item skeleton-loading">
    <div className="skeleton"></div>
  </div>
);
