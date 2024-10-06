import React, { useEffect } from "react";
import "../css/app.css";
import images from "@/constants/images";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import Sign from "./Sign";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ListMenu from "./ListMenu";

function Navbar() {
  const [showSignPage, setShowSignPage] = React.useState(false);
  const [isSignin, setIsSignin] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState(null);
  // Phân biệt đã đăng nhập hay chưa
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState(""); // Lưu tên người dùng

  // Kiểm tra token đăng nhập
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const navbarItems = [
    {
      id: 1,
      title: "Chỉnh sửa ảnh",
      menuItems: [
        { item_name: "Dashboard", item_link: "/dashboard" },
        { item_name: "Profile", item_link: "/profile" },
      ],
    },
    {
      id: 2,
      title: "Chỉnh sửa video",
      menuItems: [
        { item_name: "Company", item_link: "/company" },
        { item_name: "Team", item_link: "/team" },
      ],
    },
    {
      id: 3,
      title: "Chuyển định dạng",
      menuItems: [
        { item_name: "Development", item_link: "/web-dev" },
        { item_name: "Mobile Apps", item_link: "/mobile-apps" },
      ],
    },
  ];

  const openSigninModal = () => {
    setIsSignin(true);
    setShowSignPage(true);
  };

  const openSignupModal = () => {
    setIsSignin(false);
    setShowSignPage(true);
  };

  const closeModal = () => {
    setShowSignPage(false);
  };

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
  };

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (token && storedUsername) {
      setIsLoggedIn(true); // Cập nhật trạng thái đã đăng nhập
      setUsername(storedUsername); // Lưu username từ localStorage vào state
      console.log("Đã đăng nhập");
    }
  };

  //Hàm xử lý sau khi đăng nhập thành công
  const handleLoginSuccess = () => {
    checkLoginStatus();
    setShowSignPage(false);
  };

  const handleMouseEnter = (id) => {
    setActiveMenu(id);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <nav className="navbar">
      <span className="flex items-center">
        <div className="flex flex-row items-center" onClick={() => (window.location.href = "/")}>
          <Image
            src={images.logo}
            alt="logo"
            width={60}
            height={60}
            className="navbar-logo cursor-pointer"
          />
          <h1 className="tommorrow_font cursor-pointer">MULTITOOLS</h1>
        </div>
        <ul className="navbar-links">
          {navbarItems.map((navbarItem) => (
            <li
              key={navbarItem.id}
              className="flex items-start cursor-pointer"
              onMouseEnter={() => handleMouseEnter(navbarItem.id)}
              onMouseLeave={handleMouseLeave}
            >
              <span className="mr-2">{navbarItem.title}</span>
              <i className="fa-solid fa-sort-down"></i>
              {activeMenu === navbarItem.id && (
                <ListMenu items={navbarItem.menuItems} />
              )}
            </li>
          ))}
        </ul>
      </span>
      <div className="flex items-center">
        {isLoggedIn ? (
          <>
            <div className="navbar-user-section">
              <i class="fa-solid fa-circle-user"></i>
              <span className="mr-4">{username}</span>
              <button onClick={handleLogout}>
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
              </button>
            </div>
          </>
        ) : (
          <>
            <button onClick={openSigninModal} className="button1 signin-button">
              Đăng nhập
            </button>

            <button onClick={openSignupModal} className="button1 signup-button">
              Đăng ký
            </button>
          </>
        )}
        <ThemeToggle />
      </div>
      {showSignPage && (
        <Sign
          isSignin={isSignin}
          closeModal={closeModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}{" "}
      {/* Hiển thị SignPage khi trạng thái showSignPage là true */}
    </nav>
  );
}

export default Navbar;
