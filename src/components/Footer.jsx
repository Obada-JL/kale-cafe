import "./Footer.css";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Whatsapp from "../assets/whatsapp.svg";
import Facebook from "../assets/facebook.svg";
import Instagram from "../assets/instagram (2).svg";
import tiktok from "../assets/tiktok.svg";
function Footer() {
  return (
    <>
      <div
        id="footer"
        className="footerContainer d-flex justify-content-between mt-5 mb-5 ps-5 pe-5 w-100"
      >
        <div className="ps-5">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1002.5323193458023!2d37.37506406977993!3d37.05718194379897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1531e1ececa8d791%3A0x3a2e685038999a64!2sKale%20Cafe!5e0!3m2!1str!2str!4v1728242473548!5m2!1str!2str"
            width={325}
            height={200}
            style={{ border: "0" }}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="pe-5 d-flex flex-column justify-content-center gap-3">
          <p className="sectionTitle contactTitle">تواصل معنا</p>
          <div className="links">
            <a
              href="https://api.whatsapp.com/send/?phone=%2B905355066697&text&type=phone_number&app_absent=0"
              target="_blank"
            >
              <img src={Whatsapp} />
              <p>+90 535 506 66 97</p>
            </a>
          </div>
          <div className="links">
            <a href="https://www.facebook.com/kalecafe23/" target="_blank">
              <img src={Facebook} />
              <p>Kale Cafe</p>
            </a>
          </div>
          <div className="links">
            <a href="https://www.instagram.com/kalecafe23" target="_blank">
              <img src={Instagram} />
              <p>kalecafe23</p>
            </a>
          </div>
          <div className="links">
            <a href="https://www.tiktok.com/@kalecafe23" target="_blank">
              <img src={tiktok} id="tiktok" width={25} />
              <p>@kalekafe23</p>
            </a>
          </div>
        </div>
      </div>
      <div id="footer" className="footerMobile" style={{ width: "100vw" }}>
        <div className="mobileFooter">
          <div className="mobileLinksContainer">
            <div className="links">
              <a
                href="https://api.whatsapp.com/send/?phone=%2B905355066697&text&type=phone_number&app_absent=0"
                target="_blank"
              >
                <div className="footerIcon">
                  <img src={Whatsapp} />
                </div>

                <p className="d-flex justify-content-center  w-100 ">
                  +90 535 506 66 97
                </p>
              </a>
            </div>
            <div className="links">
              <a href="https://www.facebook.com/kalecafe23/" target="_blank">
                <div className="footerIcon">
                  <img src={Facebook} />
                </div>
                <p className="d-flex justify-content-center w-100 ">
                  Kale Cafe
                </p>
              </a>
            </div>
            <div className="links">
              <a href="https://www.instagram.com/kalecafe23" target="_blank">
                <div className="footerIcon">
                  <img src={Instagram} />
                </div>
                <p className="d-flex justify-content-center w-100 ">
                  kalecafe23
                </p>
              </a>
            </div>
            <div className="links">
              <a href="https://www.tiktok.com/@kalecafe23" target="_blank">
                <div className="footerIcon">
                  <img src={tiktok} id="tiktok" width={25} />
                </div>
                <p className="d-flex justify-content-center w-100 ">
                  @kalecafe23
                </p>
              </a>
            </div>
          </div>
          <div className="mb-3 mt-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1002.5323193458023!2d37.37506406977993!3d37.05718194379897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1531e1ececa8d791%3A0x3a2e685038999a64!2sKale%20Cafe!5e0!3m2!1str!2str!4v1728242473548!5m2!1str!2str"
              height={200}
              style={{ border: "0", width: "100%" }}
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
export default Footer;
