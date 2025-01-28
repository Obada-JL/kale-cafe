import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { api } from "../api/api";
import ellipse1 from "../assets/product ellipse.svg";
import ellipse2 from "../assets/product ellipse 2.svg";
import drinksIcon from "../assets/drinksIcon.svg";
import backArrow from "../assets/back arrow.svg";
import image2 from "../assets/image2.JPG";
import sideEllipse from "../assets/pduduct page side ellipse.svg";
import { ProductSkeleton, ImageSkeleton } from "./LoadingSkeleton";
import "../styles/loading.css";
import { ImageLoader } from "./ImageLoader";
import { ProductLoader } from "./ProductLoader";

import "./ProductCategory.css";

// Define the product data with icon, routes, etc. for each category
const productData = {
  foods: {
    icon: drinksIcon,
    category: [
      "المقبلات",
      "المأكولات الغربية",
      "المشاوي",
      "الوجبات الخفيفة",
      "المأكولات الشرقية",
    ],
    imagesRoute: "/api/getImages",
    productsRoute: "/api/getFoods", // ensure this matches your backend route
  },
  drinks: {
    icon: drinksIcon,
    category: [
      "الكوكتيلات",
      "العصير الفريش",
      "الفواكه",
      "الميلك شيك",
      "المشروبات الباردة",
      "المشروبات الساخنة",
      "مشروبات الفروزن",
      "مشروب الموهيتو البارد",
      "المشروبات الغازية",
      "عصائر الديتوكس الباردة",
      "أصناف مميزة",
    ],
    imagesRoute: "/api/getImages",
    productsRoute: "/api/getDrinks", // ensure this matches your backend route
  },
  desserts: {
    icon: drinksIcon,
    category: ["الحلويات", "حلويات فرنسية", "البوظة"],
    imagesRoute: "/api/getImages",
    productsRoute: "/api/getDesserts", // ensure this matches your backend route
  },
  hookah: {
    icon: drinksIcon,
    category: ["الأراكيل"],
    imagesRoute: "/api/getImages",
    productsRoute: "/api/getHookahs", // ensure this matches your backend route
  },
};

const ProductCategory = () => {
  const { category } = useParams(); // Get the category from the URL
  const data = productData[category]; // Get data based on category
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const scrollContainerRef = useRef(null);

  const handleMouseDown = (e) => {
    const slider = scrollContainerRef.current;
    slider.isDown = true;
    slider.startX = e.pageX - slider.offsetLeft;
    slider.scrollLeftStart = slider.scrollLeft;
  };

  const handleMouseLeave = () => {
    scrollContainerRef.current.isDown = false;
  };

  const handleMouseUp = () => {
    scrollContainerRef.current.isDown = false;
  };

  const handleMouseMove = (e) => {
    const slider = scrollContainerRef.current;
    if (!slider.isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - slider.startX) * 2; // Adjust scroll speed
    slider.scrollLeft = slider.scrollLeftStart - walk;
  };

  const categorysRef = useRef();
  const categoryScrollDown = (e) => {
    const slider = categorysRef.current;
    slider.isDown = true;
    slider.startX = e.pageX - slider.offsetLeft;
    slider.scrollLeftStart = slider.scrollLeft;
  };

  const categoryScrollLeave = () => {
    categorysRef.current.isDown = false;
  };

  const categoryScrollUp = () => {
    categorysRef.current.isDown = false;
  };

  const categoryScrollMove = (e) => {
    const slider = categorysRef.current;
    if (!slider.isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - slider.startX) * 2; // Adjust scroll speed
    slider.scrollLeft = slider.scrollLeftStart - walk;
  };

  const resetLoadingStates = () => {
    setIsImageLoading(true);
    setLoadedImages(new Set());
  };

  const handleImageLoad = (imageId) => {
    setLoadedImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(imageId);
      // Only set isImageLoading to false when all images are loaded
      if (newSet.size === images.length) {
        setTimeout(() => setIsImageLoading(false), 300); // Small delay for smooth transition
      }
      return newSet;
    });
  };

  const getSelectedCategory = async (selectedCat) => {
    setSelectedCategory(selectedCat);
    setIsLoading(true);
    resetLoadingStates();
    setError(null);

    try {
      const [productsData, imagesData] = await Promise.all([
        api.fetchProducts(data.productsRoute, selectedCat),
        api.fetchImages(data.imagesRoute, selectedCat),
      ]);

      if (productsData.length === 0) {
        setError(`No products found for ${selectedCat}`);
      }

      setProducts(productsData);
      setImages(imagesData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data && data.category.length > 0) {
      getSelectedCategory(data.category[0]);
    }
  }, [category, data]);

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  // Split products into chunks (pairs)
  const chunkedProducts = [];
  for (let i = 0; i < products.length; i += 2) {
    chunkedProducts.push(products.slice(i, i + 2));
  }

  return (
    <div>
      <div
        className="topEllipses w-100 pb-5 d-flex justify-content-between"
        style={{ position: "relative" }}
      >
        <div>
          <img src={ellipse1} alt="Ellipse 1" />
        </div>
        <div>
          <img src={ellipse2} alt="Ellipse 2" />
        </div>
      </div>
      <div className="mobileHeaderContainer">
        <a href="..">
          <img src={backArrow} width={35} />
        </a>
        <h3 className="d-flex align-items-center" style={{ marginBottom: "0" }}>
          {category == "drinks"
            ? "المشروبات"
            : category == "foods"
            ? "المأكولات"
            : category == "desserts"
            ? "الحلويات"
            : category == "hookah"
            ? "الأراكيل"
            : "Not Found"}
        </h3>
      </div>
      <div className="d-flex align-items-center gap-2 flex-row-reverse pe-3 categoryScroll allContainer">
        <img src={data.icon} alt="Category Icon" />
        <div
          ref={categorysRef}
          onMouseDown={categoryScrollDown}
          onMouseLeave={categoryScrollLeave}
          onMouseUp={categoryScrollUp}
          onMouseMove={categoryScrollMove}
          className="d-flex flex-row-reverse scroll-container"
        >
          {data.category.map((cat, index) => (
            <a
              className={
                selectedCategory == cat
                  ? "selectedCategory scroll-item"
                  : "category scroll-item"
              }
              style={{ marginLeft: ".5rem", textAlign: "right" }}
              onClick={() => getSelectedCategory(cat)}
              key={index}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      {/* Scrollable image slider */}
      <div
        className="allContainer mb-5 mt-2"
        style={{ backgroundColor: "#F4E7DB" }}
      >
        <div
          className="mainSliderContainer scroll-container"
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {(isImageLoading || images.length === 0) && (
            <div className="skeleton-container">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <ImageLoader key={`loader-${index}`} />
                ))}
            </div>
          )}
          <div
            className={`images-container ${
              isImageLoading ? "hidden" : "visible"
            }`}
          >
            {images.map((picture, index) => (
              <div
                className="sliderProduct scroll-item"
                key={picture.id || index}
              >
                <img
                  src={`https://kale-cafe.com/uploads/${picture.image}`}
                  // width={150}
                  // height={150}
                  className={`sliderProduct ${
                    loadedImages.has(picture.id || index) ? "loaded" : ""
                  }`}
                  onLoad={() => handleImageLoad(picture.id || index)}
                  alt={`Product ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products table */}
      <div
        className="productsTable mt-5 mb-5 position-relative"
        style={{ direction: "rtl" }}
      >
        <div className="position-absolute" style={{ left: "0", top: "50%" }}>
          <img src={sideEllipse} alt="Side Ellipse" className="midEllipse" />
        </div>
        <div className="table-container pb-5">
          <div className="header-container">
            <div className="table-header">أسعار منتجاتنا</div>
          </div>
          <table>
            <tbody>
              {isLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, index) => <ProductLoader key={`loader-${index}`} />)
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    لا توجد منتجات متوفرة في هذه الفئة
                  </td>
                </tr>
              ) : (
                chunkedProducts.map((pair, index) => (
                  <tr key={index}>
                    {/* First product container */}
                    <td className="w-50">
                      <div
                        className="product-container"
                        style={{
                          borderLeft: "2px solid #603813",
                          borderBottomRightRadius: "15px",
                        }}
                      >
                        <div className="product-name">{pair[0]?.name}</div>
                        <div className="product-price">{pair[0]?.price} TL</div>
                      </div>
                    </td>

                    {/* Second product container (if exists) */}
                    {pair[1] ? (
                      <td className="w-50">
                        <div
                          className="product-container"
                          style={{ borderBottomLeftRadius: "15px" }}
                        >
                          <div className="product-name">{pair[1]?.name}</div>
                          <div className="product-price">
                            {pair[1]?.price} TL
                          </div>
                        </div>
                      </td>
                    ) : (
                      <td></td> // Empty if there's no second product
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {error && (
            <div className="error-message text-center mt-3">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
