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
} from "react-icons/fa";
import {
  PiFlipHorizontalBold,
  PiFlipVerticalBold,
  PiSpiralFill,
} from "react-icons/pi";
import { AiOutlineRotateLeft, AiOutlineRotateRight } from "react-icons/ai";
import { RiColorFilterLine } from "react-icons/ri";
import { GiWoodFrame } from "react-icons/gi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";

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

  // menuItemBox: (isHovered, isActive) => ({
  //   display: "flex",
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   padding: " 5px",
  //   backgroundColor: isHovered ? "#007bff" : "",
  //   borderRadius: "5px",
  //   borderLeft: isActive ? "5px solid #00bfff" : "none",
  //   color: isHovered || isActive ? "white" : "rgba(255, 255, 255, 0.5)",
  //   cursor: "pointer",
  //   position: "relative",
  //   // transition: "all 0.3s ease",
  //   marginLeft: isHovered ? "50px" : "0px",
  // }),
  menuItemBox: (isHovered, isActive) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",  // Căn trái nội dung
    padding: "5px",
    backgroundColor: isHovered ? "#007bff" : "",
    borderRadius: "5px",
    borderLeft: isActive ? "5px solid #00bfff" : "none",
    color: isHovered || isActive ? "white" : "rgba(255, 255, 255, 0.5)",
    cursor: "pointer",
    position: "relative",
    transition: "padding-left 0.3s ease",  // Chỉ thay đổi padding-left mượt
    paddingLeft: isHovered ? "100px" : "10px",  // Thay đổi padding-left thay vì width
  }),
  menuItemIcon: {
    fontSize: "24px",
    marginBottom: "5px",
  },

  menuItemLabel: (isHovered, isActive) => ({
    display: isHovered ? "block" : "none",
    backgroundColor: "#007bff",
    padding: "5px 10px",
    // borderRadius: "2px",
    whiteSpace: "nowrap",
    color: "white",
    fontSize: "14px",
  }),

  menuRight: {
    flex: 1,
    backgroundColor: "#2e2e2e",
  },
  menuDetail: {
    fontSize: "16px",
    color: "white",
  },
  detailHeader: {
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: "10px",
    backgroundColor: "#1c1c1c",
    borderRadius: "4px",
    padding: "10px",
  },
  detailBox: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    // position: "relative",
    justifyContent: "space-between",
    height: "100%",
  },

  inputGroup: {
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputLabel: {
    fontWeight: "bold",
  },
  input: {
    padding: "5px",
    width: "80px",
    color: "black",
  },
  iconGroup: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    padding: "10px 20px",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#ccc",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  applyButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  resizeButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  resizeButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default function MenuEditor() {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
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

        {/* {menuItems.map((item) => (
          <div
            key={item.id}
            style={styles.menuItem(
              hoveredItem === item.id,
              selectedMenu === item.id
            )}
            onClick={() => handleMenuClick(item.id)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div style={styles.menuItemBox}>
              <div style={styles.menuItemIcon}>{item.icon}</div>
              <div style={styles.menuItemLabel(hoveredItem === item.id)}>
                {item.name}
              </div>
            </div>
          </div>
        ))} */}
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
          <div style={styles.menuDetail}>
            <div style={styles.menuTopBar}>Cắt ảnh</div>

            <div style={styles.detailBox}>
              <div style={styles.inputGroup}>
                <div style={styles.inputLabel}>Chiều rộng</div>
                <input type="number" style={styles.input} placeholder="" />
              </div>
              <div style={styles.inputGroup}>
                <div style={styles.inputLabel}>Chiều cao</div>
                <input type="number" style={styles.input} placeholder="" />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Chọn khung hình</label>
                <input type="checkbox" style={{ transform: "scale(1.2)" }} />
              </div>

              <div style={styles.iconGroup}>
                <AiOutlineRotateLeft
                  style={{ fontSize: "24px", cursor: "pointer" }}
                />
                <AiOutlineRotateRight
                  style={{ fontSize: "24px", cursor: "pointer" }}
                />
                <PiFlipHorizontalBold
                  style={{ fontSize: "24px", cursor: "pointer" }}
                />
                <PiFlipVerticalBold
                  style={{ fontSize: "24px", cursor: "pointer" }}
                />
              </div>

              <div style={styles.resizeButtons}>
                <button style={styles.resizeButton}>Image size</button>
                <button style={styles.resizeButton}>Kích thước trang</button>
                <button style={styles.resizeButton}>Smart resize</button>
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button style={styles.cancelButton}>Hủy</button>
              <button style={styles.applyButton}>Áp dụng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
