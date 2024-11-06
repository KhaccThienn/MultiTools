import React, { useContext, useState } from "react";
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
  MdOutlineGeneratingTokens, 
} from "react-icons/md";
import { TbBackground } from "react-icons/tb";
import "../css/menuEditor.css";
import Crop from "@/functions/Crop";
import RemoveBackground from "@/functions/RemoveBackground";
import ColorAdjustment from "@/functions/ColorAdjustment";
import Paint from "@/functions/Paint";
import { ImageContext } from "@/context/ImageContext";
import ColorFilter from "@/functions/ColorFilter";
import Retouch from "@/functions/Retouch";
import { IoMdImage } from "react-icons/io";
import TextToImage from "@/functions/TextToImage";

const menuItems = [
  { id: "crop", name: "Cắt ảnh", icon: <FaCrop /> },
  { id: "removebg", name: "Xóa nền", icon: <TbBackground /> },
  { id: "adjust", name: "Điều chỉnh màu", icon: <HiAdjustmentsHorizontal /> },
  { id: "filter", name: "Bộ lọc", icon: <RiColorFilterLine /> },
  // { id: "liquify", name: "Biến dạng hình ảnh", icon: <PiSpiralFill /> },
  { id: "retouch", name: "Làm mịn", icon: <MdFaceRetouchingNatural /> },
  { id: "paint", name: "Vẽ", icon: <FaPaintBrush /> },
  { id: "text-to-image", name: "Tạo ảnh AI", icon: <MdOutlineGeneratingTokens /> },
];

export default function MenuEditor({
  image,
  onImageUpdate,
  imageData,
  onMode,
}) {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const {setModeE} = useContext(ImageContext);

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    onMode(menuId);
    setModeE(menuId);
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
        {selectedMenu === "crop" && <Crop />}
        {selectedMenu === "removebg" && <RemoveBackground />}
        {selectedMenu === "paint" && <Paint />}
        {selectedMenu === "adjust" && <ColorAdjustment />}
        {selectedMenu === "filter" && <ColorFilter />}
        {selectedMenu === "retouch" && <Retouch />}
        {selectedMenu === "text-to-image" && <TextToImage />}
      </div>
    </section>
  );
}
