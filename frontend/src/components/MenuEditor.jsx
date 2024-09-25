import React, { useState, useEffect } from "react";
import { FaHome, FaCrop, FaObjectGroup, FaCut, FaMagic, FaPaintBrush, FaFont, FaSmile } from "react-icons/fa";
import { PiFlipHorizontalBold, PiFlipVerticalBold, PiSpiralFill } from "react-icons/pi";
import { RiColorFilterLine } from "react-icons/ri";
import { GiWoodFrame } from "react-icons/gi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Crop from "@/functions/Crop";

const menuItems = [
  { id: "crop", name: "Cắt ảnh", icon: <FaCrop /> },
  { id: "merge", name: "Ghép ảnh", icon: <FaObjectGroup /> },
  { id: "cut-part", name: "Cắt một phần", icon: <FaCut /> },
  { id: "adjust", name: "Điều chỉnh màu", icon: <HiAdjustmentsHorizontal /> },
  { id: "filter", name: "Thêm bộ lọc", icon: <RiColorFilterLine /> },
  { id: "effect", name: "Thêm hiệu ứng", icon: <FaMagic /> },
  { id: "distort", name: "Làm biến dạng", icon: <PiSpiralFill /> },
  { id: "draw", name: "Vẽ", icon: <FaPaintBrush /> },
  { id: "text", name: "Thêm chữ", icon: <FaFont /> },
  { id: "frame", name: "Thêm khung", icon: <GiWoodFrame /> },
  { id: "emoji", name: "Thêm emoji", icon: <FaSmile /> },
];

const styles = {
  menuContainer: {
    display: "flex",
    height: "100%",
  },
  menuLeft: {
    width: "80px",
    backgroundColor: "#2e2e2e",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRight: "1px solid black",
  },
  menuTopBar: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#1c1c1c",
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
    borderBottom: "10px groove #454545",
  },
  menuItemBox: (isHovered, isActive) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "5px",
    backgroundColor: isHovered ? "#007bff" : "",
    borderRadius: "5px",
    borderLeft: isActive ? "5px solid #00bfff" : "none",
    color: isHovered || isActive ? "white" : "rgba(255, 255, 255, 0.5)",
    cursor: "pointer",
    position: "relative",
    transition: "padding-left 0.3s ease",
    paddingLeft: isHovered ? "100px" : "10px",
  }),
  menuItemIcon: {
    fontSize: "24px",
    marginBottom: "5px",
  },
  menuItemLabel: (isHovered, isActive) => ({
    display: isHovered ? "block" : "none",
    backgroundColor: "#007bff",
    padding: "5px 10px",
    whiteSpace: "nowrap",
    color: "white",
    fontSize: "14px",
  }),
  menuRight: {
    flex: 1,
    backgroundColor: "#2e2e2e",
  },
};

export default function MenuEditor({ image, onImageUpdate, onMode }) {  // Thêm đúng props
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    onMode(menuId);  // Gọi trực tiếp hàm onMode khi một menu được chọn
  };

  return (
    <div style={styles.menuContainer}>
      <div style={styles.menuLeft}>
        <div style={styles.menuTopBar}>
          <FaHome
            style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
            onClick={() => handleMenuClick("home")}
          />
        </div>
        {menuItems.map((item) => (
          <div
            key={item.id}
            style={styles.menuItemBox(
              hoveredItem === item.id,
              selectedMenu === item.id
            )}
            onClick={() => handleMenuClick(item.id)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div style={styles.menuItemIcon}>{item.icon}</div>
            <div
              style={styles.menuItemLabel(
                hoveredItem === item.id,
                selectedMenu === item.id
              )}
            >
              {item.name}
            </div>
          </div>
        ))}
      </div>
      <div style={styles.menuRight}>
        {selectedMenu === "crop" && (
          <Crop image={image} onImageUpdate={onImageUpdate} />
        )}
      </div>
    </div>
  );
}
