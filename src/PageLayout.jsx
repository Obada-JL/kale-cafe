import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import "./PageLayout.css";
import Footer from "./components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
// import Footer from "./Footer";

function PageLayout() {
  return (
    <div className="pageContainer" style={{ width: "98.9vw" }}>
      <NavBar />

      <div className="MainPageConatiner">
        <Outlet />
      </div>
      <div className="d-flex justify-content-center pt-3">
        <Footer />
      </div>
      {/* <a href="https://api.whatsapp.com/send/?phone=%2B905355066697&text&type=phone_number&app_absent=0">
        <FontAwesomeIcon
          icon={faWhatsapp}
          size="2xl"
          // style={{ fontSize: "50px", color: "#25D366" }}
          className="mb-3 fixedWhatsappIcon"
        />
      </a> */}
    </div>
  );
}
export default PageLayout;
