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
import "./ErrorDisplay.css";

// Error types for better error handling
const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  CATEGORIES_LOAD: 'CATEGORIES_LOAD',
  PRODUCTS_LOAD: 'PRODUCTS_LOAD',
  IMAGES_LOAD: 'IMAGES_LOAD'
};

// Define the product data with icon, routes, etc. for each category
const productData = {
  foods: {
    icon: drinksIcon,
    categoriesRoute: "http://kale-cafe.com/api/getFoodCategories",
    imagesRoute: "/api/getFoodImages",
    productsRoute: "/api/getFoods",
  },
  drinks: {
    icon: drinksIcon,
    categoriesRoute: "http://kale-cafe.com/api/getDrinkCategories",
    imagesRoute: "/api/getDrinkImages",
    productsRoute: "/api/getDrinks",
  },
  desserts: {
    icon: drinksIcon,
    categoriesRoute: "http://kale-cafe.com/api/getDessertCategories",
    imagesRoute: "/api/getDessertImages",
    productsRoute: "/api/getDesserts",
  },
  hookah: {
    icon: drinksIcon,
    categoriesRoute: "http://kale-cafe.com/api/getHookahCategories",
    imagesRoute: "/api/getHookahImages",
    productsRoute: "/api/getHookahs",
  },
};

const ProductCategory = () => {
  const { category } = useParams(); // Get the category from the URL
  const data = productData[category]; // Get data based on category
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const scrollContainerRef = useRef(null);

  // Helper function to determine error type and message based on status code
  const handleApiError = (error, operation = 'operation') => {
    let errorType = ERROR_TYPES.NETWORK;
    let errorMessage = `فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.`;

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      switch (status) {
        case 400:
          errorType = ERROR_TYPES.BAD_REQUEST;
          errorMessage = 'طلب غير صحيح. يرجى التحقق من البيانات المرسلة.';
          break;
        case 404:
          errorType = ERROR_TYPES.NOT_FOUND;
          errorMessage = 'البيانات المطلوبة غير موجودة.';
          break;
        case 500:
          errorType = ERROR_TYPES.SERVER_ERROR;
          errorMessage = 'خطأ في الخادم. يرجى المحاولة لاحقاً.';
          break;
        default:
          errorMessage = `خطأ في الخادم (${status}). يرجى المحاولة لاحقاً.`;
      }
    } else if (error.request) {
      // Network error
      errorType = ERROR_TYPES.NETWORK;
      errorMessage = 'فشل في الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت.';
    }

    return { errorType, errorMessage };
  };

  // Retry function with exponential backoff
  const retryOperation = async (operation, maxRetries = 3) => {
    setIsRetrying(true);
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        setRetryCount(i + 1);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000)); // Exponential backoff
        const result = await operation();
        setIsRetrying(false);
        setRetryCount(0);
        return result;
      } catch (error) {
        lastError = error;
        console.warn(`Retry ${i + 1}/${maxRetries} failed:`, error);
      }
    }

    setIsRetrying(false);
    setRetryCount(0);
    throw lastError;
  };

  const handleMouseDown = (e) => {
    const slider = scrollContainerRef.current;
    if (!slider) return;
    slider.isDown = true;
    slider.startX = e.pageX - slider.offsetLeft;
    slider.scrollLeftStart = slider.scrollLeft;
  };

  const handleMouseLeave = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.isDown = false;
    }
  };

  const handleMouseUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.isDown = false;
    }
  };

  const handleMouseMove = (e) => {
    const slider = scrollContainerRef.current;
    if (!slider || !slider.isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - slider.startX) * 2; // Adjust scroll speed
    slider.scrollLeft = slider.scrollLeftStart - walk;
  };

  const categorysRef = useRef();
  const categoryScrollDown = (e) => {
    const slider = categorysRef.current;
    if (!slider) return;
    slider.isDown = true;
    slider.startX = e.pageX - slider.offsetLeft;
    slider.scrollLeftStart = slider.scrollLeft;
  };

  const categoryScrollLeave = () => {
    if (categorysRef.current) {
      categorysRef.current.isDown = false;
    }
  };

  const categoryScrollUp = () => {
    if (categorysRef.current) {
      categorysRef.current.isDown = false;
    }
  };

  const categoryScrollMove = (e) => {
    const slider = categorysRef.current;
    if (!slider || !slider.isDown) return;
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
      if (newSet.size === images.length && images.length > 0) {
        setTimeout(() => setIsImageLoading(false), 300); // Small delay for smooth transition
      }
      return newSet;
    });
  };

  const getSelectedCategory = async (selectedCat) => {
    resetLoadingStates();
    setSelectedCategory(selectedCat);

    // Find the category object to get its ObjectId
    const categoryObj = categories.find(cat => cat.name === selectedCat || cat._id === selectedCat);
    const categoryId = categoryObj ? categoryObj._id : selectedCat;
    console.log("categoryId", categoryId, "selectedCat", selectedCat, "categories", categoryObj);
    setSelectedCategoryId(categoryId);

    if (!data?.productsRoute || !data?.imagesRoute) {
      setError('رابط المنتجات أو الصور غير صحيح');
      setErrorType(ERROR_TYPES.BAD_REQUEST);
      return;
    }

    try {
      const fetchData = async () => {
        console.log("productsRoute", data.productsRoute, "categoryId", categoryId);
        console.log("imagesRoute", data.imagesRoute, "categoryId", categoryId);

        const [productsData, imagesData] = await Promise.all([
          api.fetchProducts(data.productsRoute, categoryId),
          api.fetchImages(data.imagesRoute, categoryId),
        ]);

        console.log("productsData", productsData, "imagesData", imagesData);

        if (productsData.length === 0 && imagesData.length === 0) {
          setError(`لا توجد منتجات أو صور متوفرة للفئة: ${selectedCat}`);
          setErrorType(ERROR_TYPES.NOT_FOUND);
        } else {
          setProducts(productsData);
          console.log("imagesData", imagesData);
          setImages(imagesData);
          setError(null);
          setErrorType(null);
        }

        setIsLoading(false);
        setIsImageLoading(false);
        console.log("closed loading");
      };

      await retryOperation(fetchData);
    } catch (error) {
      console.error("Error fetching data:", error);
      const { errorType: type, errorMessage } = handleApiError(error, 'loading products');
      setError(errorMessage);
      setErrorType(type);
      setIsLoading(false);
    } finally {
      setIsImageLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!data?.categoriesRoute) {
      setError('رابط الفئات غير صحيح');
      setErrorType(ERROR_TYPES.BAD_REQUEST);
      return;
    }

    try {
      const fetchCategoriesData = async () => {
        const response = await fetch(data.categoriesRoute);

        if (!response.ok) {
          const error = new Error(`HTTP ${response.status}`);
          error.response = { status: response.status };
          throw error;
        }

        const categoriesData = await response.json();
        if (!Array.isArray(categoriesData)) {
          throw new Error('Invalid categories data format');
        }

        return categoriesData;
      };

      const categoriesData = await retryOperation(fetchCategoriesData);

      if (categoriesData.length === 0) {
        setError('لا توجد فئات متوفرة');
        setErrorType(ERROR_TYPES.NOT_FOUND);
      } else {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      const { errorType: type, errorMessage } = handleApiError(error, 'loading categories');
      setError(errorMessage);
      setErrorType(type);

      // Fallback to empty categories
      setCategories([]);
    }
  };

  // Manual retry function for user interaction
  const handleRetry = () => {
    setError(null);
    setErrorType(null);
    setRetryCount(0);

    if (categories.length === 0) {
      fetchCategories();
    } else if (selectedCategory) {
      getSelectedCategory(selectedCategory);
    }
  };

  useEffect(() => {
    if (data && data.categoriesRoute) {
      fetchCategories();
    } else {
      setError('فئة المنتج غير صحيحة');
      setErrorType(ERROR_TYPES.BAD_REQUEST);
    }
  }, [category, data]);

  useEffect(() => {
    if (categories.length > 0) {
      // Use the first category's name for selection
      getSelectedCategory(categories[0].name);
    }
  }, [categories]);

  // Error UI Component
  const ErrorDisplay = ({ error, errorType, onRetry, isRetrying, retryCount }) => {
    const getErrorConfig = (type) => {
      // Using cafe brand colors: #603813 (dark brown), #e0be9d (light brown), #f4e7db (beige)
      switch (type) {
        case ERROR_TYPES.NETWORK:
          return {
            icon: '🌐',
            title: 'مشكلة في الاتصال',
            gradient: 'linear-gradient(135deg, #7b4a2d 0%, #603813 100%)',
            lightGradient: 'linear-gradient(135deg, #f4e7db 0%, #e0be9d 100%)',
            color: '#603813',
            lightColor: '#7b4a2d'
          };
        case ERROR_TYPES.SERVER_ERROR:
          return {
            icon: '⚠️',
            title: 'خطأ في الخادم',
            gradient: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
            lightGradient: 'linear-gradient(135deg, #f4e7db 0%, #deb887 100%)',
            color: '#8b4513',
            lightColor: '#a0522d'
          };
        case ERROR_TYPES.NOT_FOUND:
          return {
            icon: '🔍',
            title: 'لم يتم العثور على البيانات',
            gradient: 'linear-gradient(135deg, #6d4c2f 0%, #8b6f47 100%)',
            lightGradient: 'linear-gradient(135deg, #f4e7db 0%, #e8d5c4 100%)',
            color: '#6d4c2f',
            lightColor: '#8b6f47'
          };
        case ERROR_TYPES.BAD_REQUEST:
          return {
            icon: '❌',
            title: 'طلب غير صحيح',
            gradient: 'linear-gradient(135deg, #cd853f 0%, #daa520 100%)',
            lightGradient: 'linear-gradient(135deg, #f4e7db 0%, #f5deb3 100%)',
            color: '#cd853f',
            lightColor: '#daa520'
          };
        default:
          return {
            icon: '⚡',
            title: 'حدث خطأ',
            gradient: 'linear-gradient(135deg, #7b4a2d 0%, #603813 100%)',
            lightGradient: 'linear-gradient(135deg, #f4e7db 0%, #e0be9d 100%)',
            color: '#603813',
            lightColor: '#7b4a2d'
          };
      }
    };

    const config = getErrorConfig(errorType);

    return (
      <div className="error-display-container" style={{
        margin: '2rem auto',
        maxWidth: '500px',
        padding: '2rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #f9f7f4 100%)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(96, 56, 19, 0.15)',
        border: '2px solid #f4e7db',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: config.gradient,
        }}></div>

        {/* Floating shapes */}
        <div className="floating-shape" style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: config.lightGradient,
          opacity: '0.3'
        }}></div>

        <div className="floating-shape delayed" style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: config.lightGradient,
          opacity: '0.3'
        }}></div>

        {/* Error icon */}
        <div className="error-icon" style={{
          fontSize: '4rem',
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          {config.icon}
        </div>

        {/* Error title */}
        <h3 className="error-title" style={{
          color: config.color,
          textAlign: 'center',
          marginBottom: '1rem',
          fontSize: '1.5rem',
          fontWeight: '700',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {config.title}
        </h3>

        {/* Error message */}
        <p className="error-message" style={{
          color: '#8b6f47',
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {error}
        </p>

        {/* Retry section */}
        {isRetrying ? (
          <div className="retry-section" style={{
            textAlign: 'center',
            padding: '1rem',
            background: config.lightGradient,
            borderRadius: '12px',
            marginBottom: '1rem',
            border: '1px solid #e0be9d'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: config.color,
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              <div className="custom-spinner" style={{
                width: '20px',
                height: '20px',
                border: `3px solid ${config.color}30`,
                borderTop: `3px solid ${config.color}`,
                borderRadius: '50%'
              }}></div>
              جاري المحاولة {retryCount}/3...
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <button
              className="retry-btn"
              onClick={onRetry}
              disabled={isRetrying}
              style={{
                background: config.gradient,
                border: 'none',
                borderRadius: '50px',
                padding: '12px 30px',
                color: '#f4e7db',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(96, 56, 19, 0.3)',
                transform: 'translateY(0)',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              🔄 إعادة المحاولة
            </button>
          </div>
        )}
      </div>
    );
  };

  // Loading fallback
  if (isLoading && categories.length === 0 && !error) {
    return (
      <div className="loading-container text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
        <p className="mt-2">جاري تحميل الفئات...</p>
      </div>
    );
  }

  // Error fallback for critical errors (categories not loading)
  if (error && categories.length === 0) {
    return (
      <div>
        <div className="topEllipses w-100 pb-5 d-flex justify-content-between" style={{ position: "relative" }}>
          <div><img src={ellipse1} alt="Ellipse 1" /></div>
          <div><img src={ellipse2} alt="Ellipse 2" /></div>
        </div>
        <div className="mobileHeaderContainer">
          <a href=".."><img src={backArrow} width={35} /></a>
          <h3 className="d-flex align-items-center" style={{ marginBottom: "0" }}>
            {category == "drinks" ? "المشروبات" : category == "foods" ? "المأكولات" :
              category == "desserts" ? "الحلويات" : category == "hookah" ? "الأراكيل" : "غير موجود"}
          </h3>
        </div>
        <ErrorDisplay
          error={error}
          errorType={errorType}
          onRetry={handleRetry}
          isRetrying={isRetrying}
          retryCount={retryCount}
        />
      </div>
    );
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

      {/* Categories Section */}
      <div className="d-flex align-items-center gap-2 flex-row-reverse pe-3 categoryScroll allContainer">
        <img src={data?.icon || drinksIcon} alt="Category Icon" />
        <div
          ref={categorysRef}
          onMouseDown={categoryScrollDown}
          onMouseLeave={categoryScrollLeave}
          onMouseUp={categoryScrollUp}
          onMouseMove={categoryScrollMove}
          className="d-flex flex-row-reverse scroll-container"
        >
          {categories.map((cat, index) => (
            <a
              className={
                selectedCategory == cat.name
                  ? "selectedCategory scroll-item"
                  : "category scroll-item"
              }
              style={{ marginLeft: ".5rem", textAlign: "right" }}
              onClick={() => getSelectedCategory(cat.name)}
              key={index}
            >
              {cat.name}
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
          {(isImageLoading) && !error && (
            <div className="skeleton-container">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <ImageLoader key={`loader-${index}`} />
                ))}
            </div>
          )}
          <div
            className={`images-container ${isImageLoading ? "hidden" : "visible"
              }`}
          >
            {images.map((picture, index) => (
              <div
                className="sliderProduct scroll-item"
                key={picture.id || index}
              >
                <img
                  src={`http://kale-cafe.com/uploads/${picture.imagePath || picture.image}`}
                  className={`sliderProduct ${loadedImages.has(picture.id || index) ? "loaded" : ""
                    }`}
                  onLoad={() => handleImageLoad(picture.id || index)}
                  onError={(e) => {
                    e.target.style.display = 'none'; // Hide broken images
                  }}
                  alt={`Product ${index + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Show error for images if needed */}
          {error && errorType === ERROR_TYPES.IMAGES_LOAD && (
            <div className="p-3 text-center">
              <small className="text-muted">فشل في تحميل بعض الصور</small>
            </div>
          )}
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
                    {error && errorType === ERROR_TYPES.NOT_FOUND ? (
                      <div style={{
                        padding: '2rem',
                        borderRadius: '15px',
                        background: 'linear-gradient(135deg, #f4e7db 0%, #e0be9d 100%)',
                        border: '2px dashed #c8792f',
                        margin: '1rem 0'
                      }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <p style={{
                          margin: '0 0 1rem 0',
                          color: '#603813',
                          fontSize: '1.1rem',
                          fontWeight: '600'
                        }}>
                          لا توجد منتجات متوفرة في هذه الفئة
                        </p>
                        <button
                          className="retry-btn-small"
                          onClick={() => getSelectedCategory(selectedCategory)}
                          disabled={isRetrying}
                          style={{
                            background: 'linear-gradient(135deg, #7b4a2d 0%, #603813 100%)',
                            border: 'none',
                            borderRadius: '25px',
                            padding: '8px 20px',
                            color: '#f4e7db',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(96, 56, 19, 0.3)'
                          }}
                        >
                          🔄 إعادة التحميل
                        </button>
                      </div>
                    ) : (
                      <div style={{
                        padding: '2rem',
                        color: '#8b6f47',
                        fontSize: '1.1rem',
                        background: 'linear-gradient(135deg, #f9f7f4 0%, #f4e7db 100%)',
                        borderRadius: '10px',
                        border: '1px solid #e0be9d'
                      }}>
                        لا توجد منتجات متوفرة في هذه الفئة
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                chunkedProducts.map((pair, index) => (
                  <tr key={index} className="product-row d-flex">
                    {/* First product container */}
                    {/* <td className="w-50 h-100"> */}
                    <div
                      className="product-container"
                      style={{
                        borderLeft: "2px solid #603813",
                        borderBottomRightRadius: "15px",
                      }}
                    >
                      <div className="product-name">{pair[0]?.name || 'غير محدد'}</div>
                      <div className="product-price">{pair[0]?.price || '0'} TL</div>
                    </div>
                    {/* </td> */}

                    {/* Second product container (if exists) */}
                    {pair[1] ? (
                      // <td className="w-50 h-100">
                      <div
                        className="product-container"
                        style={{ borderBottomLeftRadius: "15px" }}
                      >
                        <div className="product-name">{pair[1]?.name || 'غير محدد'}</div>
                        <div className="product-price">{pair[1]?.price || '0'} TL</div>
                      </div>
                      // </td>
                    ) : (
                      <td></td> // Empty if there's no second product
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Show error for products/images loading */}
          {error && errorType !== ERROR_TYPES.NOT_FOUND && (
            <ErrorDisplay
              error={error}
              errorType={errorType}
              onRetry={handleRetry}
              isRetrying={isRetrying}
              retryCount={retryCount}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
