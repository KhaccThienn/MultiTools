// import React, { useState } from 'react';
import "../css/app.css";
import ThemeToggle from "./ThemeToggle";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AvatarPopup = ({ handleLogout }) => {
    const menuItems = [
      { name: "Settings", icon: "fa-solid fa-gear" },
      { name: "My Profile", icon: "fa-solid fa-user" },
      { name: "Log Out", icon: "fa-solid fa-arrow-right-from-bracket" },
      
    ];
  
    
    const handleItemClick = (index) => {
      console.log(`Clicked on menu item at index: ${index}`);
      if (index === 0) {
        console.log("Navigating to Settings...");
      } else if (index === 1) {
        window.location.href = "/Profile";
        console.log("Navigating to My Profile...");
      } else if (index === 2) {
        handleLogout();
      }
    };

    return (
      <div className="avatar-popup">
        <ul className="popup-menu">
          {menuItems.map((item, index) => (
            <li key={index} onClick={() => handleItemClick(index)}>
              <i className={item.icon}></i> {item.name}
            </li>
          ))}
        </ul>
        <div className='dark-mode'>
          <div className="name" >
            <i class="fa-solid fa-moon"></i>
            <span>Dark Mode</span>
          </div>
          <ThemeToggle/>
        </div>
      </div>

    );
  };

export default AvatarPopup;
