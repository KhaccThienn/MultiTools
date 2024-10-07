import React from "react";
import Image from "next/image";
import "../css/app.css";
import images from "@/constants/images";
import "@fortawesome/fontawesome-free/css/all.min.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer1">
        <div className="logo-section">
          <Image
            src={images.logo}
            alt="logo"
            width={60}
            height={60}
            className="navbar-logo"
          />
          <h1 className="tommorrow_font">MULTITOOLS</h1>
        </div>
        <div className="links-section"></div>
        <div className="links-section"></div>
        <div className="contact-section">
          <div className="contact-info">
            <p>Liên Hệ với chúng tôi</p>
            <i className="fab fa-facebook"></i>
            <i className="fab fa-google-plus"></i>
          </div>
        </div>
      </div>
      <div className="footer2">
        <div className="copy-right">
          <p>Copyright 2024 MultiTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
