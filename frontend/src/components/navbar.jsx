import React, { useEffect } from "react";
import "../css/app.css";
import images from "@/constants/images";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import Sign from "./Sign";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ListMenu from "./ListMenu";
import AvatarPopup from "./AvatarPopup";
import { MdArrowDropDown } from "react-icons/md";

function Navbar() {
  const [showSignPage, setShowSignPage] = React.useState(false);
  const [isSignin, setIsSignin] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [avatar, setAvatar] = React.useState("");
  const [openAvatar, setOpenAvatar] = React.useState(false);
  // Kiểm tra token đăng nhập
  useEffect(() => {

    checkLoginStatus();
  }, []);
  

  const navbarItems = [
    {
      id: 1,
      title: "Chỉnh sửa ảnh",
      menuItems: [
        { item_name: "Chỉnh sửa ảnh", containerIndex: 0, link: "/ImageEditorPage" },
        { item_name: "Tách nền ảnh", containerIndex: 1, link: "/ImageEditorPage" },
        { item_name: "Làm nét/mờ ảnh", containerIndex: 0, link: "/ImageEditorPage" },
        { item_name: "Điều chỉnh màu sắc", containerIndex: 1, link: "/ImageEditorPage" },
        { item_name: "Ghép ảnh", containerIndex: 1, link: "/ImageEditorPage" },
      ],
    },
    {
      id: 2,
      title: "Chỉnh sửa video",
      menuItems: [
        { item_name: "Chỉnh sửa video", containerIndex: 2, link: "/VideoEditorPage" },
        { item_name: "Cắt video", containerIndex: 3, link: "/VideoEditorPage" },
        { item_name: "Ghép video", containerIndex: 2, link: "/VideoEditorPage" },
      ],
    },
    {
      id: 3,
      title: "Chuyển định dạng",
      menuItems: [
        { item_name: "Hình ảnh", containerIndex: 4, link: "/ConvertPage" },
        { item_name: "Tài liệu", containerIndex: 5, link: "/ConvertPage" },
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

  // const openAvatarPopup = () => {
  //   setOpenAvatar(!openAvatar);
  // }
  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("avatar");
    setIsLoggedIn(false);
    setOpenAvatar(false); 
    setAvatar("");
  };


  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedAvatar = localStorage.getItem("avatar");
    if (token && storedUsername) {
      setIsLoggedIn(true); // Cập nhật trạng thái đã đăng nhập
      setAvatar(storedAvatar); 
      console.log("Đã đăng nhập");
    }
  };

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="navbar">
      <span
        className="flex items-center"
        onClick={scrollToTop}
        style={{ cursor: "pointer" }}
      >
        <Image
          src={images.logo}
          alt="logo"
          width={60}
          height={60}
          className="navbar-logo"
        />
        <h1 className="tommorrow_font">MULTITOOLS</h1>
      </span>
      <ul className="navbar-links">
        {navbarItems.map((navbarItem) => (
          <li
            key={navbarItem.id}
            className="li-item"
            onMouseEnter={() => handleMouseEnter(navbarItem.id)}
            onMouseLeave={handleMouseLeave}
          >
            <span style={{marginRight:'5px'}}>{navbarItem.title}</span>
            <MdArrowDropDown className="drop-down-icon"/>
            {activeMenu === navbarItem.id && (
              <ListMenu
                items={navbarItem.menuItems.map((item) => ({
                  ...item,
                  onClick: () => {
                    if (item.link) {
                      window.location.href = item.link;
                    } else if (item.containerIndex !== null) {
                      scrollToContainer(item.containerIndex);
                    } else {
                      scrollToTop();
                    }
                  },
                }))}
              />
            )}
          </li>
        ))}
      </ul>
      <div className="sign-buttons">
        {isLoggedIn ? (
          <>
            <div className="navbar-user-section">
             <Image
                src={avatar || "/images/default-avatar.png"}  // Sử dụng avatar từ localStorage hoặc avatar mặc định
                alt="User Avatar"
                width={40}
                height={40}
                className="navbar-avatar"
                onClick={() => {
                  setOpenAvatar(!openAvatar);
                }}
             />
              {openAvatar && <AvatarPopup handleLogout={handleLogout} />}
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
      </div>
      {showSignPage && (
        <Sign
          isSignin={isSignin}
          closeModal={closeModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </nav>
  );
}

export default Navbar;
