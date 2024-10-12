import Logo from "../assets/Logo.png";
import ArabicFlag from "../assets/arabic flag.png";
import TurkishFlag from "../assets/Flag_of_Turkey.svg.png";
import "./NavBar.css";
import { useParams } from "react-router-dom";
function NavBar() {
  const { category } = useParams();
  return (
    <div
      className="navAllContainer d-flex justify-content-center mt-4 navbar navbar-expand-lg"
      style={{ position: "absolute", zIndex: "555" }}
    >
      <div className="navContainer d-flex justify-content-center d-flex justify-content-between flex-row-reverse align-items-center p-3 ps-5 pe-5">
        <div className="d-flex gap-5 flex-row-reverse align-items-center">
          <a href="/">
            <img src={Logo} width={60} />
          </a>
          <div className="d-flex flex-row-reverse align-items-center gap-3">
            <a href="/" className={category ? "page" : "routedPage"}>
              الأصناف
            </a>
            <a href="/#products" className={category ? "routedPage" : "page"}>
              المنتجات
            </a>
          </div>
        </div>
        <a href="#footer" className="routedPage">
          تواصل معنا
        </a>
      </div>
    </div>
  );
}
export default NavBar;
