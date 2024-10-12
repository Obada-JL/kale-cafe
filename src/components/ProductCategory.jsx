import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ellipse1 from "../assets/product ellipse.svg";
import ellipse2 from "../assets/product ellipse 2.svg";
import drinksIcon from "../assets/drinksIcon.svg";
import backArrow from "../assets/back arrow.svg";

import "./ProductCategory.css";

// Define the product data with icon, routes, etc. for each category
const productData = {
  foods: {
    icon: drinksIcon,
    category: ["Foods", "FastFoods"],
    imagesRoute: "/api/foods/images",
    productsRoute: "/api/getFoods",
  },
  drinks: {
    icon: drinksIcon,
    category: [
      "ميلك شيك",
      " شيك",
      "المشروبات الغازية",
      "العصير الفريش",
      "الكوكتيلات",
      "مشروبات الفروزن",
      "مشروب الموهيتو البارد",
      "مشروبات باردة",
      "عصائر الديتوكس الباردة",
      "المشروبات الساخنة",
      "الكوكتيلات",
    ],
    imagesRoute: "/api/drinks/images",
    productsRoute: "/api/getDrinks",
  },
  desserts: {
    icon: drinksIcon,
    category: ["Desserts", "FastDesserts"],
    imagesRoute: "/api/desserts/images",
    productsRoute: "/api/getDesserts",
  },
};

const ProductCategory = () => {
  const { category } = useParams(); // Get the category from the URL
  const data = productData[category]; // Get data based on category
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
  const getSelectedCategory = (category) => {
    fetchProducts(category);
  };
  const fetchProducts = async (selectedCategoryName) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://kale-cafe-server.onrender.com${data.productsRoute}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const productsData = await res.json();
      if (Array.isArray(productsData)) {
        const filteredProducts = productsData.filter(
          (product) =>
            // data.category.includes(product.category)
            selectedCategoryName == product.category
        );
        setProducts(filteredProducts);
      } else {
        console.error("productsData is not an array:", productsData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setIsLoading(false);
  };
  // Fetch data from API
  useEffect(() => {
    if (data) {
      fetchProducts(data.category[0]);
      setSelectedCategory(data.category[0]);
    }
  }, [category, data]);

  // Handle invalid category
  if (!data) {
    return <div>Category not found</div>;
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
            ? "المشروبات"
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
              onClick={() => {
                setSelectedCategory(cat);
                getSelectedCategory(cat);
              }}
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
          <div className="sliderProduct scroll-item">
            <img
              src="src/assets/image2.JPG"
              width={150}
              className="sliderProduct"
            />
          </div>
          <div className="sliderProduct scroll-item">
            <img
              src="src/assets/image2.JPG"
              width={150}
              className="sliderProduct"
            />
          </div>
          <div className="sliderProduct scroll-item">
            <img
              src="src/assets/image2.JPG"
              width={150}
              className="sliderProduct"
            />
          </div>
          <div className="sliderProduct scroll-item">
            <img
              src="src/assets/image2.JPG"
              width={150}
              className="sliderProduct"
            />
          </div>
          <div className="sliderProduct scroll-item">
            <img
              src="src/assets/image2.JPG"
              width={150}
              className="sliderProduct"
            />
          </div>
          <div className="sliderProduct scroll-item">
            <img
              src="src/assets/image2.JPG"
              width={150}
              className="sliderProduct"
            />
          </div>
          <div className="sliderProduct scroll-item">
            <img
              src="src/assets/image2.JPG"
              width={150}
              className="sliderProduct"
            />
          </div>
          {/* {images.map((image, index) => (
            <div key={index} className="sliderProduct scroll-item">
              <img
                src={image.src}
                alt={`Product ${index}`}
                width={150}
                className="sliderProduct"
              />
            </div>
          ))} */}
        </div>
      </div>

      {/* Products table */}
      <div
        className="productsTable mt-5 mb-5 position-relative"
        style={{ direction: "rtl" }}
      >
        <div className="position-absolute" style={{ left: "0", top: "50%" }}>
          <img
            src="/src/assets/pduduct page side ellipse.svg"
            alt="Side Ellipse"
            className="midEllipse"
          />
        </div>
        <div className="table-container pb-5">
          <div className="header-container">
            <div className="table-header">أسعار منتجاتنا</div>
          </div>
          {isLoading == true ? (
            <div class="spinner center">
              <div class="spinner-blade"></div>
              <div class="spinner-blade"></div>
              <div class="spinner-blade"></div>
              <div class="spinner-blade"></div>
              <div class="spinner-blade"></div>
              <div class="spinner-blade"></div>
              <div class="spinner-blade"></div>
              <div class="spinner-blade"></div>
              <div class="spinner-blade"></div>
              <div class="spinner-blade"></div>
              <div class="spinner-blade"></div>
              <div class="spinner-blade"></div>
            </div>
          ) : (
            <></>
          )}
          <table>
            <tbody>
              {chunkedProducts.map((pair, index) => (
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
                        <div className="product-price">{pair[1]?.price} TL</div>
                      </div>
                    </td>
                  ) : (
                    <td></td> // Empty if there's no second product
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
