import React, { useContext, useEffect, useState, useRef } from "react";
import { AiOutlineRotateLeft, AiOutlineRotateRight } from "react-icons/ai";
import { PiFlipHorizontalBold, PiFlipVerticalBold } from "react-icons/pi";
import { FaTimes } from "react-icons/fa";
import { ImageContext } from "@/context/ImageContext";
import "../css/menuEditor.css";

function Crop() {
  const {
    cropBoxData,
    updateCropBoxData,
    resetCropBoxData,
    handleCrop,
    handleAspectRatioChange,
  } = useContext(ImageContext);

  const handleResizeCropBox = (e) => {
    const { id, value } = e.target;
    updateCropBoxData(id, value);
  };

  // Hàm xử lý xoay trái
  const handleRotateLeft = () => {
    updateCropBoxData("rotate", cropBoxData.rotate - 90);
  };

  // Hàm xử lý xoay phải
  const handleRotateRight = () => {
    updateCropBoxData("rotate", cropBoxData.rotate + 90);
  };

  // Hàm xử lý lật ngang
  const handleFlipHorizontal = () => {
    updateCropBoxData("flipHorizontal", !cropBoxData.flipHorizontal);
  };

  // Hàm xử lý lật dọc
  const handleFlipVertical = () => {
    updateCropBoxData("flipVertical", !cropBoxData.flipVertical);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value >= -180 && value <= 180) {
      updateCropBoxData("rotate", value);
    }
  };

  const handleAspectRatio = (value) => {
    updateCropBoxData("aspectRatio", value);
  };

  useEffect(() => {
    if (cropBoxData.aspectRatio !== undefined) {
      handleAspectRatioChange();
    }
  }, [cropBoxData.aspectRatio]);

  return (
    <section id="crop" className="tool-drawer">
      <div className="tool-name">
        <div></div>
        Cắt ảnh
        <button
          onClick={resetCropBoxData}
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
              <input
                type="number"
                id="crop-width"
                value={cropBoxData.width.toFixed(2)}
                onChange={(e) =>
                  updateCropBoxData("width", Number(e.target.value))
                }
              />
            </div>
            <div className="split">
              <label htmlFor="crop-heigh">Chiều cao</label>
              <input
                type="number"
                id="crop-height"
                value={cropBoxData.height.toFixed(2)}
                onChange={(e) =>
                  updateCropBoxData("height", Number(e.target.value))
                }
              />
            </div>

            <div className="toggle-select-frame">
              <label className="select-label">Tỉ lệ mẫu</label>
              <div className="select">
                <select
                  id="select-frame-menu"
                  onChange={(e) => handleAspectRatio(e.target.value)} // Gọi hàm khi thay đổi option
                >
                  <option value="0:0" selected>
                    Không
                  </option>
                  <option value="" disabled style={{ fontWeight: "bold" }}>
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
                  <option value="2560:1440">Kênh nghệ thuật Youtube</option>
                  <option value="1280:720">Hình thu nhỏ trên Youtube</option>
                  <option value="1024:768">Trang web mini 1024x768</option>
                  <option value="1280:800">Trang web nhỏ 1280x800</option>
                  <option value="1366:768">Trang web phổ biến 1366x768</option>
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
                value={cropBoxData.rotate}
                onChange={handleInputChange}
                className="rotation-input"
              />
              <div className="rotation-slider-box">
                <span>-180 </span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={cropBoxData.rotate}
                  onChange={handleInputChange}
                  className="rotation-slider"
                />
                <span> 180</span>
              </div>
            </div>

            <ul id="crop-rotate-flip" className="crop-rotate-flip">
              <li id="rotate-left" className="rotate-flip">
                <label htmlFor="rotate-flip-icon">Xoay trái</label>
                <div className="rotate-flip-icon" onClick={handleRotateLeft}>
                  <AiOutlineRotateLeft />
                </div>
              </li>
              <li id="rotate-right" className="rotate-flip">
                <label htmlFor="rotate-flip-icon">Xoay phải</label>
                <div className="rotate-flip-icon" onClick={handleRotateRight}>
                  <AiOutlineRotateRight />
                </div>
              </li>
              <li id="flip-horizontal" className="rotate-flip">
                <label htmlFor="rotate-flip-icon">Lật ngang</label>
                <div
                  className="rotate-flip-icon"
                  onClick={handleFlipHorizontal}
                >
                  <PiFlipHorizontalBold />
                </div>
              </li>
              <li id="flip-vertical" className="rotate-flip">
                <label htmlFor="rotate-flip-icon">Lật dọc</label>
                <div className="rotate-flip-icon" onClick={handleFlipVertical}>
                  <PiFlipVerticalBold />
                </div>
              </li>
            </ul>
          </div>
          <div className="bottom-content">
            <div className="action-btn">
              <button id="crop-action-cancel" onClick={resetCropBoxData}>
                Hủy
              </button>
              <button id="crop-action-apply" onClick={handleCrop}>
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Crop;
