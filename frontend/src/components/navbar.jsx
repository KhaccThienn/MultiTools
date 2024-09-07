import React from "react";
import "../css/app.css";
import images from "@/constants/images";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import Sign from "./Sign";

function Navbar() {
  const [showSignPage, setShowSignPage] = React.useState(false); // Trạng thái mở SignPage
  const [isSignin, setIsSignin] = React.useState(false); // Để phân biệt giữa Đăng nhập và Đăng ký

  const openSigninModal = () => {
    setIsSignin(true); // Mở modal Đăng nhập
    setShowSignPage(true);
  };

  const openSignupModal = () => {
    setIsSignin(false); // Mở modal Đăng ký
    setShowSignPage(true);
  };

  const closeModal = () => {
    setShowSignPage(false);
  };

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
        <button onClick={openSigninModal} className="signin-button">
          Đăng nhập
        </button>

        <button onClick={openSignupModal} className="button1 signup-button">
          Đăng ký
        </button>

        <ThemeToggle />
      </div>

      {showSignPage && <Sign isSignin={isSignin} closeModal={closeModal} />}{" "}
      {/* Hiển thị SignPage khi trạng thái showSignPage là true */}
    </nav>
  );
}

export default Navbar;
