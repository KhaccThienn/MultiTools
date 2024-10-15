import React, { useState } from "react";
import Image from "next/image";
import "../css/app.css";
import images from "@/constants/images";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaRegCopyright } from "react-icons/fa6";
import { GrLanguage } from "react-icons/gr";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BsPatchQuestion } from "react-icons/bs";

const Footer = () => {
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

  const toggleAnswer = (index) => {
    if (openQuestionIndex === index) {
      setOpenQuestionIndex(null);
    } else {
      setOpenQuestionIndex(index);
    }
  };

  return (
    <footer className="footer">
      <section className="footer-detail">
        <div className="footer-elements">
          <div className="links-section">
            <h3>Về chúng tôi</h3>
            <a href="">Giới thiệu</a>
            <a href="">Tin tức</a>
            <a href="">Tuyển dụng</a>
            <a href="">Đối tác</a>
          </div>
          <div className="links-section">
            <h3>Pháp lý</h3>
            <a href="">Điều khoản sử dụng</a>
            <a href="">Chính sách bảo mật</a>
            <a href="">Chính sách cookie</a>
            <a href="">Thỏa thuận cấp phép</a>
          </div>
          <div className="links-section">
            <h3>Sản phẩm</h3>
            <a href="">MultiTools Image Editor</a>
            <a href="">MultiTools Video Editor</a>
            <a href="">MultiTools Converter</a>
          </div>
          <div className="links-section">
            <h3>Trợ giúp</h3>
            <a href="">Hướng dẫn sử dụng</a>
            <a href="">Hỏi đáp</a>
            <a href="">Liên hệ với chúng tôi</a>
            <a href="">Giá cả</a>
          </div>
          <div className="links-section">
            <h3>Theo dõi chúng tôi</h3>
            <a href="">Blog</a>
            <a href="">Facebook</a>
            <a href="">Instagram</a>
            <a href="">Twitter</a>
            <a href="">Discord</a>
            <a href="">Youtube</a>
          </div>
        </div>
        <div className="footer-language">
          <div className="language-icon">
            <GrLanguage />
          </div>
          <div className="languages">
            <a href="">Tiếng Việt</a>
            <a href="">English</a>
            <a href="">Bahasa</a>
            <a href="">Español</a>
            <a href="">Français</a>
            <a href="">Indonesia</a>
            <a href="">Italiano</a>
            <a href="">Nederlands</a>
            <a href="">Polski</a>
            <a href="">Português</a>
            <a href="">Türkçe</a>
            <a href="">Русский</a>
            <a href="">日本語</a>
            <a href="">한국어</a>
            <a href="">中文</a>
          </div>
        </div>
      </section>
      <div className="footer-end">
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
        <div className="copyright">
          <span>MultiTools</span>
          <FaRegCopyright />
          <span>2024</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
