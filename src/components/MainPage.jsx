import "./MainPage.css";
import MainImage from "../assets/kale cafe image.jpeg";
import TriangleImage from "../assets/triangle-rounded-divider.svg";
import ellipse1 from "../assets/Ellipse 8.svg";
import ellipse2 from "../assets/Group 8.svg";
import image2 from "../assets/image2.JPG";
import productsEllipse from "../assets/productsSection ellipse.svg";
import sectionIcon1 from "../assets/Frame 33.svg";
import sectionIcon2 from "../assets/Frame 30.svg";
import sectionIcon3 from "../assets/Frame 32.svg";
import sectionIcon4 from "../assets/Frame 31.svg";
import { useEffect, useRef, useState } from "react";
function MainPage() {
  const scrollContainerRef = useRef(null);
  const [images, setImages] = useState([]);

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
  const fetchImages = async (selectedImgaesCategory) => {
    // console.log(data.imagesRoute);
    try {
      const res = await fetch(`https://kale-cafe.com/api/getSpecialImages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const ImagesData = await res.json();
      console.log(ImagesData);
      setImages(ImagesData);

      // if (Array.isArray(ImagesData)) {
      //   const filteredImages = ImagesData.filter(
      //     (image) =>
      //       // data.category.includes(image.category)
      //       selectedImgaesCategory == image.category
      //   );
      //   setImages(filteredImages);
      // } else {
      //   console.error("ImagesData is not an array:", ImagesData);
      // }
    } catch (error) {
      console.error("Error fetching Images:", error);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);
  return (
    <div>
      <div>
        <div className="section1 d-flex">
          <div
            className="ellipses"
            style={{
              position: "absolute",
              right: "0",
              top: "0",
              userSelect: "none",
            }}
          >
            <img src={ellipse1} />
          </div>
          <div
            className="ellipses"
            style={{
              position: "absolute",
              right: "0",
              bottom: "0",
              userSelect: "none",
            }}
          >
            <img src={ellipse2} />
          </div>
          <div className="d-flex w-100" style={{ position: "relative" }}>
            <div
              className="section1Container"
              style={{
                position: "relative",
                flex: "60%",
              }}
            >
              <img
                src={MainImage}
                style={{
                  maxHeight: "100vh",
                  // width: "957px",
                  objectFit: "cover",
                  position: "relative",

                  // flex: "60%",
                  width: "100%",
                }}
              />
            </div>
            <div
              style={{
                clipPath:
                  " polygon(100% 0%, 100% 49%, 100% 100%, 34% 100%, 0% 50%, 38% 0)",
                width: "350px",
                backgroundColor: "white",
                objectFit: "cover",
                position: "absolute",
                height: "100%",
                right: "0",
                // marginRight: "560px",
                marginRight: "40%",
              }}
              className="triangleShape"
            ></div>
            <div className="section1Texts" style={{ flex: "40%" }}>
              <div className="textContainer">
                <h2 className="cafeName">Kale Cafe</h2>
                <p className="slogan">المذاق الأصيل في قلب القلعة</p>
              </div>
              <div>
                <a href="#footer" className="mobileContactButton routedPage">
                  تواصل معنا
                </a>
              </div>
            </div>
          </div>
        </div>
        <div id="products" className="section2 pb-3">
          <p className="sectionHeader pt-5 pb-3">الأصناف</p>
          <div className="titlesContainer d-flex justify-content-around">
            <a href="/hookah" className="sectionItem">
              <div className="iconContainer">
                <img src={sectionIcon3} alt="" className="sectionIcon" />
              </div>
              <div>
                <p className="sectionTitle">الأراكيل </p>
              </div>
            </a>
            <a href="/desserts" className="sectionItem">
              <div className="iconContainer">
                <img src={sectionIcon1} alt="" className="sectionIcon" />
              </div>
              <div>
                <p className="sectionTitle">الحلويات</p>
              </div>
            </a>
            <a href="/drinks" className="sectionItem">
              <div className="iconContainer">
                <img src={sectionIcon4} alt="" className="sectionIcon" />
              </div>
              <div>
                <p className="sectionTitle">المشروبات</p>
              </div>
            </a>
            <a href="/foods" className="sectionItem">
              <div className="iconContainer">
                <img src={sectionIcon2} alt="" className="sectionIcon" />
              </div>
              <div>
                <p className="sectionTitle">المأكولات</p>
              </div>
            </a>
          </div>
        </div>
        <div className="section3 mb-5 pb-5">
          <div
            style={{
              position: "absolute",
              left: "0",
              top: "0",
              userSelect: "none",
            }}
            className="productsMainEllipse"
          >
            <img src={productsEllipse} />
          </div>
          <p className="sectionHeader pt-5 pb-3">من منتجاتنا</p>
          <div className="allContainer">
            <div
              className="mainSliderContainer scroll-container"
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {images.map((picture, index) => (
                <div className="sliderProductContainer scroll-item" key={index}>
                  <img
                    src={`https://kale-cafe.com/uploads/${picture.image}`}
                    width={300}
                    className="sliderProduct mainSlider"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MainPage;
