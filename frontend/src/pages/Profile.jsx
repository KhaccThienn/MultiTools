import React, { useState, useEffect } from "react";
import "../css/profile.css";
import "../app/globals.css";
import UserInfo from "../components/UserInfo";
import ChangePassword from "../components/ChangePassword";
import ChangeAvatar from "../components/ChangeAvatar";
import { FcHome } from "react-icons/fc";
import { FiEdit } from "react-icons/fi";

export default function Profile() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    loadInfo();
  }, []);

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  const loadInfo = () => {
    const avatarUrl = localStorage.getItem("avatar");
    setAvatar(avatarUrl);
    setUsername(localStorage.getItem("username"));
  };

  const handleAvatarChange = (newAvatar) => {
    setAvatar(newAvatar);
  };

  const handleBack = () => {
    setActiveIndex(0);
  };

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  return (
    <div className="profile-page">
      <div className="home-button" onClick={handleHomeClick}>
        <FcHome />
      </div>

      <div className="sidebar">
        <div className="user-section">
          <img
            src={avatar}
            alt="User Avatar"
            onClick={() => handleClick(4)}
            style={{
              cursor: "pointer",
              borderRadius: "50%",
              width: "200px",
              height: "200px",
            }}
          />
          <div className="edit-icon">
            <FiEdit onClick={() => handleClick(4)}/>
          </div>
          <span>{username}</span>
        </div>
        <ul className="menu">
          {["📝 Thông tin cá nhân", "🖼️ Ảnh của tôi", "🔒 Đổi mật khẩu"].map(
            (item, index) => (
              <li
                key={index}
                className={activeIndex === index ? "active" : ""}
                onClick={() => handleClick(index)}
              >
                <span>{item}</span>
              </li>
            )
          )}
        </ul>
      </div>
      <div className="main-content">
        {activeIndex === 0 && <UserInfo />}
        {activeIndex === 2 && <ChangePassword />}
        {activeIndex === 4 && (
          <ChangeAvatar
            onAvatarChange={handleAvatarChange}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
