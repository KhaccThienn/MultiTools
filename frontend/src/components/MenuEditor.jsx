import React, { useState } from "react";
import {
  FaHome,
  FaCrop,
  FaObjectGroup,
  FaCut,
  FaMagic,
  FaPaintBrush,
  FaFont,
  FaSmile,
  FaTimes,
} from "react-icons/fa";
import {
  PiFlipHorizontalBold,
  PiFlipVerticalBold,
  PiSpiralFill,
} from "react-icons/pi";
import { AiOutlineRotateLeft, AiOutlineRotateRight } from "react-icons/ai";
import { RiColorFilterLine, RiPictureInPictureLine } from "react-icons/ri";
import { GiWoodFrame } from "react-icons/gi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import {
  MdFaceRetouchingNatural,
  MdPhotoSizeSelectLarge,
  MdKeyboardArrowRight,
} from "react-icons/md";
import "../css/menuEditor.css";
import Crop from "@/functions/Crop";

const menuItems = [
  { id: "merge", name: "Ghép ảnh", icon: <FaObjectGroup /> },
  { id: "crop", name: "Cắt ảnh", icon: <FaCrop /> },
  { id: "cutout", name: "Cắt một phần", icon: <FaCut /> },
  { id: "adjust", name: "Điều chỉnh màu", icon: <HiAdjustmentsHorizontal /> },
  // { id: "effect", name: "Hiệu ứng", icon: <FaMagic /> },
  { id: "filter", name: "Bộ lọc", icon: <RiColorFilterLine /> },
  // { id: "ai", name: "AI Tools", icon: <FaMagic /> },
  { id: "liquify", name: "Biến dạng hình ảnh", icon: <PiSpiralFill /> },
  { id: "retouch", name: "Tinh chỉnh", icon: <MdFaceRetouchingNatural /> },
  { id: "paint", name: "Vẽ", icon: <FaPaintBrush /> },
  { id: "add-text", name: "Văn bản", icon: <FaFont /> },
  { id: "add-element", name: "Thành phần", icon: <FaSmile /> },
];

export default function MenuEditor({ image, onImageUpdate, imageData, onMode }) {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    onMode(menuId);  // Gọi trực tiếp hàm onMode khi một menu được chọn
  };



  return (
    <section id="menu-bar">
      <div className="menu-left">
        <div className="toggle-home" id="toggle-home">
          <div
            id="toggle-home-box"
            className="toggle-home-box"
            onMouseEnter={() => setHoveredItem("home")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <FaHome id="home-icon" className="home-icon" />
            <span id="home-span" className="home-span">
              Trang chủ
            </span>
          </div>
        </div>

        <div className="splitter"></div>
        <ul id="tool-menu" className="tool-menu">
          {menuItems.map((item) => (
            <li
              key={item.id}
              data={item.id}
              id={`menu-item-box ${item.id}`}
              className={`menu-item-box ${
                hoveredItem === item.id ? "hovered" : ""
              } ${selectedMenu === item.id ? "active" : ""}`}
              onClick={() => handleMenuClick(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="menu-item-icon">{item.icon}</div>
              <span className="menu-item-span">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="menu-right">
        {selectedMenu === "crop" && (
          <Crop/>

        )}
      </div>
    </section>
  );
}
