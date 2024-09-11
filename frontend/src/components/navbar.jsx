import React from "react";
import "../css/app.css";
import images from "@/constants/images";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import Sign from "./Sign";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ListMenu from "./ListMenu";

function Navbar() {
  const [showSignPage, setShowSignPage] = React.useState(false); // Trạng thái mở SignPage
  const [isSignin, setIsSignin] = React.useState(false); // Để phân biệt giữa Đăng nhập và Đăng ký
  // Trạng thái để quản lý mục navbar nào đang được nhấn
  const [activeMenu, setActiveMenu] = React.useState(null);

  // Dữ liệu cho các navbar_item và các menuItem tương ứng
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

  // Hàm để mở menu khi hover
  const handleMouseEnter = (id) => {
    setActiveMenu(id); // Kích hoạt menu khi di chuột vào
  };

  // Hàm để đóng menu khi rời chuột
  const handleMouseLeave = () => {
    setActiveMenu(null); // Đóng menu khi rời chuột
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
          {navbarItems.map((navbarItem) => (
            <li key={navbarItem.id} className="flex items-start cursor-pointer"
            onMouseEnter={() => handleMouseEnter(navbarItem.id)} // Kích hoạt khi hover
            onMouseLeave={handleMouseLeave} // Đóng menu khi rời chuột
            >
              <span
                className="mr-2"
              >
                {navbarItem.title}
              </span>
              <i className="fa-solid fa-sort-down"></i>
              {activeMenu === navbarItem.id && (
                <ListMenu items={navbarItem.menuItems} />
              )}
            </li>
          ))}
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
