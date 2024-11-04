// // import React, { useState } from 'react';
// import "../css/app.css";
// import ThemeToggle from "./ThemeToggle";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// const AvatarPopup = ({ handleLogout, offsetLeft }) => {
//   const menuItems = [
//     { name: "Cài đặt", icon: "fa-solid fa-gear" },
//     { name: "Hồ sơ cá nhân", icon: "fa-solid fa-user" },
//     { name: "Đăng xuất", icon: "fa-solid fa-arrow-right-from-bracket" },
//   ];

//   const handleItemClick = (index) => {
//     console.log(`Clicked on menu item at index: ${index}`);
//     if (index === 0) {
//       console.log("Navigating to Settings...");
//     } else if (index === 1) {
//       window.location.href = "/Profile";
//       console.log("Navigating to My Profile...");
//     } else if (index === 2) {
//       handleLogout();
//     }
//   };

//   return (
//     <div
//       className="avatar-popup"
//       style={{ width: `calc(100vw - ${offsetLeft}px)` }}
//     >
//       <ul className="popup-menu">
//         {menuItems.map((item, index) => (
//           <li key={index} onClick={() => handleItemClick(index)}>
//             <i className={item.icon}></i> {item.name}
//           </li>
//         ))}
//       </ul>
//       <div className="dark-mode">
//         <div className="name">
//           <i class="fa-solid fa-moon"></i>
//           <span>Giao diện tối</span>
//         </div>
//         <ThemeToggle />
//       </div>
//     </div>
//   );
// };

// export default AvatarPopup;




// components/AvatarPopup.jsx
"use client";
import { useContext } from "react";
import "../css/app.css";
import ThemeContext from "@/constants/themes/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AvatarPopup = ({ handleLogout, offsetLeft }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  console.log('AvatarPopup toggleTheme:', typeof toggleTheme);
  const menuItems = [
    { name: "Cài đặt", icon: "fa-solid fa-gear" },
    { name: "Hồ sơ cá nhân", icon: "fa-solid fa-user" },
    { name: "Đăng xuất", icon: "fa-solid fa-arrow-right-from-bracket" },
  ];

  const handleItemClick = (index) => {
    if (index === 0) {
      console.log("Navigating to Settings...");
      // Thêm logic điều hướng nếu cần
    } else if (index === 1) {
      window.location.href = "/Profile";
    } else if (index === 2) {
      handleLogout();
    }
  };

  return (
    <div
      className="avatar-popup"
      style={{
        width: `calc(100vw - ${offsetLeft}px)`,
        // Các style khác nếu cần
      }}
    >
      <ul className="popup-menu">
        {menuItems.map((item, index) => (
          <li key={index} onClick={() => handleItemClick(index)}>
            <i className={item.icon}></i> {item.name}
          </li>
        ))}
      </ul>
      <div className="dark-mode">
        <div className="name">
          <i className="fa-solid fa-moon"></i>
          <span>Giao diện tối</span>
        </div>
        <ThemeToggle toggleTheme={toggleTheme} theme={theme} />
      </div>
    </div>
  );
};

export default AvatarPopup;
