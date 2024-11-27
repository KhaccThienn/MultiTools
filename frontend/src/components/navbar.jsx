/* components/navbar.jsx */
"use client";
import React, { useEffect, useContext } from "react";
import "../css/app.css";
import ThemeContext from "@/constants/themes/ThemeContext";
import images from "@/constants/images";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import Sign from "./Sign";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ListMenu from "./ListMenu";
import AvatarPopup from "./AvatarPopup";
import { MdArrowDropDown } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showSignPage, setShowSignPage] = React.useState(false);
  const [isSignin, setIsSignin] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [avatar, setAvatar] = React.useState("");
  const [openAvatar, setOpenAvatar] = React.useState(false);
  const navbarUserSectionRef = React.useRef(null);
  const [offsetLeft, setOffsetLeft] = React.useState(0);

  useEffect(() => {
    function updateOffset() {
      if (navbarUserSectionRef.current) {
        setOffsetLeft(navbarUserSectionRef.current.offsetLeft);
      }
    }

    window.addEventListener("resize", updateOffset);
    updateOffset();
    return () => {
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  // Kiểm tra token đăng nhập
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const navbarItems = [
    {
      id: 1,
      title: "Chỉnh sửa ảnh",
      menuItems: [
        {
          item_name: "Chỉnh sửa ảnh",
          item_link: "/ImageEditorPage",
        },
        {
          item_name: "Tách nền ảnh",
          item_link: "/ImageEditorPage",
        },
        {
          item_name: "Thêm bộ lọc",
          item_link: "/ImageEditorPage",
        },
        {
          item_name: "Điều chỉnh màu sắc",
          item_link: "/ImageEditorPage",
        },
        {
          item_name: "Vẽ lên ảnh",
          item_link: "/ImageEditorPage",
        },
      ],
    },
    {
      id: 2,
      title: "Chỉnh sửa video",
      menuItems: [
        {
          item_name: "Chỉnh sửa video",
          item_link: "/VideoEditorPage",
        },
        {
          item_name: "Thêm phụ đề",
          item_link: "/VideoEditorPage",
        },
        {
          item_name: "Thêm bộ lọc",
          item_link: "/VideoEditorPage",
        },
        {
          item_name: "Cắt video",
          item_link: "/VideoEditorPage",
        },
      ],
    },
    {
      id: 3,
      title: "Chỉnh sửa audio",
      menuItems: [
        {
          item_name: "Chỉnh sửa audio",
          item_link: "/AudioEditorPage",
        },
        {
          item_name: "Chỉnh tốc độ",
          item_link: "/AudioEditorPage",
        },
        {
          item_name: "Chỉnh âm lượng",
          item_link: "/AudioEditorPage",
        },
        {
          item_name: "Cắt audio",
          item_link: "/AudioEditorPage",
        },
      ],
    },
    {
      id: 4,
      title: "Chuyển định dạng",
      menuItems: [
        {
          item_name: "File",
          item_link: "/ConvertPage",
        },
        {
          item_name: "Youtube to MP3",
          item_link: "/ConvertYoutubePage",
        },
      ],
    },
    {
      id: 5,
      title: "Chức năng AI",
      menuItems: [
        {
          item_name: "Chuyển văn bản thành hình ảnh",
          item_link: "/ImageEditorPage",
        },
        {
          item_name: "Làm mịn da",
          item_link: "/ImageEditorPage",
        },
        // {
        //   item_name: "Xóa watermark",
        //   item_link: "/ImageEditorPage",
        // },
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
      <a
        className="logo-container"
        href="/"
        // onClick={scrollToTop}
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
      </a>
      <ul className="navbar-links">
        {navbarItems.map((navbarItem) => (
          <li
            key={navbarItem.id}
            className="li-item"
            onMouseEnter={() => handleMouseEnter(navbarItem.id)}
            onMouseLeave={handleMouseLeave}
          >
            <span>{navbarItem.title}</span>
            <IoIosArrowDown className="drop-down-icon" />
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
            <div className="navbar-user-section" ref={navbarUserSectionRef}>
              <Image
                src={avatar || "/images/default-avatar.png"}
                alt="User Avatar"
                width={40}
                height={40}
                className="navbar-avatar"
                onClick={() => {
                  setOpenAvatar(!openAvatar);
                }}
              />
              {openAvatar && (
                <AvatarPopup
                  handleLogout={handleLogout}
                  offsetLeft={offsetLeft}
                  toggleTheme={toggleTheme}
                  theme={theme}
                />
              )}
              <IoIosArrowDown
                className={`avt-drop-icon ${openAvatar ? "rotate" : ""}`}
                onClick={() => {
                  setOpenAvatar(!openAvatar);
                }}
              />
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
