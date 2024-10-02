import React from "react";
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


  const handleMouseEnter = (id) => {
    setActiveMenu(id);
  };


  const handleMouseLeave = () => {
    setActiveMenu(null); 
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
            onMouseEnter={() => handleMouseEnter(navbarItem.id)} 
            onMouseLeave={handleMouseLeave} 
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
