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

export default function MenuEditor() {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    onMode(menuId);  // Gọi trực tiếp hàm onMode khi một menu được chọn
  };

  const handleCancelClick = () => {
    setSelectedMenu(null);
  };

  const handleSliderChange = (e) => {
    setRotationAngle(e.target.value);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value >= -180 && value <= 180) {
      setRotationAngle(value);
    }
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
              // window.location.href = "/";
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
          <section id="crop" className="tool-drawer">
            <div className="tool-name">
              <div></div>
              Cắt ảnh
              <button
                onClick={handleCancelClick}
                className="icon-cancel"
                id="icon-cancel"
              >
                <FaTimes />
              </button>
            </div>
            <div className="splitter"></div>
            <div id="crop-content" className="tool-content">
              <div className="tool-detail">
                <div className="group group1">
                  <div className="split">
                    <label htmlFor="crop-width">Chiều rộng</label>
                    <input type="number" id="crop-width" />
                  </div>
                  <div className="split">
                    <label htmlFor="crop-heigh">Chiều cao</label>
                    <input type="number" id="crop-height" />
                  </div>

                  {/* <div className="select-crop-frame">
                    <label
                      className="toggle-check-label"
                      htmlFor="toggle-check"
                    >
                      Chọn khung hình
                    </label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        className="toggle-check-input"
                        id="toggle-check"
                      />
                      <span className="slider round"></span>
                    </label>
                  </div> */}

                  <div className="toggle-select-frame">
                    {/* <div className="switch-field stretch">
                      <input
                        type="radio"
                        id="crop-aspect-ratio"
                        name="crop-aspect-mode"
                        value="ratio"
                        defaultChecked
                      />
                      <label htmlFor="crop-aspect-ratio">Tỉ lệ</label>
                      <input
                        type="radio"
                        id="crop-aspect-size"
                        name="crop-aspect-mode"
                        value="size"
                      />
                      <label htmlFor="crop-aspect-size">Kích thước</label>
                    </div> */}
                    {/* <div className="split">
                      Chiều rộng
                      <input
                        type="number"
                        id="crop-aspect-width"
                        defaultValue="1"
                      />
                    </div> */}
                    {/* <div className="split">
                      Chiều cao
                      <input
                        type="number"
                        id="crop-aspect-height"
                        defaultValue="1"
                      />
                    </div> */}
                    <label className="select-label">Tỉ lệ mẫu</label>
                    <div className="select">
                      <select id="select-frame-menu">
                        <option value="0:0" selected>
                          Không
                        </option>
                        <option
                          value=""
                          disabled
                          style={{ fontWeight: "bold" }}
                        >
                          Tỉ lệ cố định
                        </option>
                        <option value="x:y">Gốc</option>
                        <option value="1:1">1:1 (Vuông)</option>
                        <option value="4:3">4:3</option>
                        <option value="3:4">3:4</option>
                        <option value="14:9">14:9</option>
                        <option value="16:9">16:9 (Màn hình rộng)</option>
                        <option value="9:16">9:16 (Story)</option>
                        <option value="16:10">16:10</option>
                        <option value="2:1">2:1</option>
                        <option value="3:1">3:1 (Toàn cảnh)</option>
                        <option value="4:1">4:1</option>
                        <option value="3:2">3:2 (Máy quay phim 35mm)</option>
                        <option value="5:4">5:4</option>
                        <option value="7:5">7:5</option>
                        <option value="19:10">19:10</option>
                        <option value="21:9">21:9 (Điện ảnh)</option>
                        <option value="32:9">32:9 (Siêu rộng)</option>
                        <option
                          value=""
                          disabled
                          style={{
                            fontWeight: "bold",
                            borderTop: "5px solid black",
                          }}
                        >
                          Kích thước đầu ra
                        </option>
                        <option value="180:180">Ảnh đại diện Facebook</option>
                        <option value="851:315">Ảnh bìa Facebook</option>
                        <option value="1200:900">Bài đăng Facebook</option>
                        <option value="1280:720">Quảng cáo Facebook</option>
                        <option value="180:180">Ảnh đại diện Instagram</option>
                        <option value="1080:1080">Ảnh bìa Instagram</option>
                        <option value="1080:1920">Story Instagram</option>
                        <option value="150:150">Ảnh đại diện Twitter</option>
                        <option value="1500:500">Tiêu đề Twitter</option>
                        <option value="1024:512">Ảnh Twitter</option>
                        <option value="1200:628">Thẻ Twitter</option>
                        <option value="1200:675">Quảng cáo Twitter</option>
                        <option value="800:800">Ảnh đại diện Youtube</option>
                        <option value="2560:1440">
                          Kênh nghệ thuật Youtube
                        </option>
                        <option value="1280:720">
                          Hình thu nhỏ trên Youtube
                        </option>
                        <option value="1024:768">
                          Trang web mini 1024x768
                        </option>
                        <option value="1280:800">Trang web nhỏ 1280x800</option>
                        <option value="1366:768">
                          Trang web phổ biến 1366x768
                        </option>
                        <option value="1440:900">
                          Trang web trung bình 1440x900
                        </option>
                        <option value="1920:1080">Full HD 1920x1080</option>
                        <option value="3840:2160">Siêu HD 4K 3840x2160</option>
                        <option value="2480:3508">Khổ giấy A4</option>
                        <option value="1748:2480">Khổ giấy A5</option>
                        <option value="1280:1748">Khổ giấy A6</option>
                        <option value="2400:3300">Giấy viết thư</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="group group2">
                  <label className="crop-rotate-label">Xoay và lật</label>

                  <div className="rotation-slider-container">
                    <input
                      type="number"
                      min="-180"
                      max="180"
                      value={rotationAngle}
                      onChange={handleInputChange}
                      className="rotation-input"
                    />
                    <div className="rotation-slider-box">
                      <span>-180 </span>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={rotationAngle}
                        onChange={handleSliderChange}
                        className="rotation-slider"
                      />
                      <span> 180</span>
                    </div>
                  </div>

                  <ul id="crop-rotate-flip" className="crop-rotate-flip">
                    <li id="rotate-left" className="rotate-flip">
                      <label htmlFor="rotate-flip-icon">Xoay trái</label>
                      <div className="rotate-flip-icon">
                        <AiOutlineRotateLeft />
                      </div>
                    </li>
                    <li id="rotate-right" className="rotate-flip">
                      <label htmlFor="rotate-flip-icon">Xoay phải</label>
                      <div className="rotate-flip-icon">
                        <AiOutlineRotateRight />
                      </div>
                    </li>
                    <li id="flip-horizontal" className="rotate-flip">
                      <label htmlFor="rotate-flip-icon">Lật ngang</label>
                      <div className="rotate-flip-icon">
                        <PiFlipHorizontalBold />
                      </div>
                    </li>
                    <li id="flip-vertical" className="rotate-flip">
                      <label htmlFor="rotate-flip-icon">Lật dọc</label>
                      <div className="rotate-flip-icon">
                        <PiFlipVerticalBold />
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bottom-content">
                  <div className="action-btn">
                    <button id="crop-action-cancel">Hủy</button>
                    <button id="crop-action-apply">Áp dụng</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
