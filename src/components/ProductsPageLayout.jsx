import { Outlet } from "react-router-dom";

const ProductsPageLayout = ({ children }) => {
  return (
    <div>
      <div>
        <Outlet />
      </div>
      {/* Render the dynamic product category content */}
    </div>
  );
};

export default ProductsPageLayout;
