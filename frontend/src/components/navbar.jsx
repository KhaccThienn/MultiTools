import React from "react";
import "../css/app.css";
import images from "@/constants/images";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  return (
    <nav className="navbar">
      <span className="flex items-center">
        <Image
          src={images.logo}
          alt="logo"
          width={60}
          height={60}
          className="navbar-logo"
        />
        <h1 className="tommorrow_font">MULTITOOLS</h1>
        <ul className="navbar-links">
          <li>
            <a href="">Chỉnh sửa ảnh</a>
          </li>
          <li>
            <a href="">Chỉnh sửa video</a>
          </li>
          <li>
            <a href="">Chuyển định dạng</a>
          </li>
        </ul>
      </span>

      <div className="flex items-center">
        <span>
          <a href="">Đăng nhập</a>
        </span>
        <span className="button1">
          <a href="">Đăng ký</a>
        </span>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar;
