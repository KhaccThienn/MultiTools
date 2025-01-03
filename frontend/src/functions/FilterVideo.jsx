// FilterVideo.jsx

import React, { useContext } from "react";
import { FaMagic, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import "../css/menuEditor.css"; // Ensure this CSS file exists and is correctly styled
import { VideoContext } from "@/context/VideoContext";
import { FaSpinner } from "react-icons/fa6";

const FilterVideo = ({ onClose }) => {
  const {
    adjustmentData,
    updateAdjustmentData,
    resetAdjustmentData,
    handleAdjustment, // Optional: may not be needed
    isProcessing, // Optional: may not be needed
  } = useContext(VideoContext);

  // Handlers for individual adjustments
  const setBrightness = (value) => updateAdjustmentData("brightness", value);
  const setSaturation = (value) => updateAdjustmentData("saturation", value);
  const setContrast = (value) => updateAdjustmentData("contrast", value);
  const setHue = (value) => updateAdjustmentData("hue", value);
  const setGreyScale = (value) => updateAdjustmentData("grey_scale", value);
  const setSepia = (value) => updateAdjustmentData("sepia", value);
  const setInvert = (value) => updateAdjustmentData("invert", value);
  const setBlur = (value) => updateAdjustmentData("blur", value);

  // Preset: Auto Adjust
  const autoAdjust = () => {
    // Example auto-adjust values
    const autoBrightness = 120;
    const autoContrast = 110;
    const autoSaturation = 115;
    const grey_scale = 0;

    updateAdjustmentData("brightness", autoBrightness);
    updateAdjustmentData("contrast", autoContrast);
    updateAdjustmentData("saturation", autoSaturation);
    updateAdjustmentData("grey_scale", grey_scale);
  };

  // Preset: Toggle Grayscale
  const toggleGrayscale = () => {
    const newGrayscale = adjustmentData.grey_scale >= 50 ? 0 : 100;
    updateAdjustmentData("grey_scale", newGrayscale);
  };

  // Preset: Pop Image
  const popImage = () => {
    const popBrightness = 150;
    const popContrast = 120;
    const popSaturation = 125;
    const grey_scale = 0;

    updateAdjustmentData("brightness", popBrightness);
    updateAdjustmentData("contrast", popContrast);
    updateAdjustmentData("saturation", popSaturation);
    updateAdjustmentData("grey_scale", grey_scale);
  };

  return (
    <div className="tool-drawer">
      <div className="tool-name">
        <div></div>
        Điều chỉnh màu video
        <button onClick={onClose} className="icon-cancel" id="icon-cancel">
          <FaTimes />
        </button>
      </div>
      <div className="splitter"></div>
      <div className="box__option">
        <button className="btn" onClick={autoAdjust}>
          <FaMagic /> Tự động
        </button>
        <button className="btn" onClick={toggleGrayscale}>
          <FaMoon /> Trắng Đen
        </button>
        <button className="btn" onClick={popImage}>
          <FaSun /> Bật ra
        </button>
      </div>

      <div className="box--basic slider-section">
        <h4 className="box__header">Màu</h4>

        <div className="slider-group">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Độ sáng</label>
            <label>{adjustmentData.brightness}</label>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={adjustmentData.brightness}
            onChange={(e) => setBrightness(e.target.value)}
            className="slider__balance"
          />
        </div>

        <div className="slider-group">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Độ tương phản</label>
            <label>{adjustmentData.saturation}</label>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={adjustmentData.saturation}
            onChange={(e) => setSaturation(e.target.value)}
          />
        </div>

        <div className="slider-group">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Độ bão hòa màu</label>
            <label>{adjustmentData.contrast}</label>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={adjustmentData.contrast}
            onChange={(e) => setContrast(e.target.value)}
          />
        </div>

        <div className="slider-group">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Sắc độ</label>
            <label>{adjustmentData.hue}</label>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={adjustmentData.hue}
            onChange={(e) => setHue(e.target.value)}
          />
        </div>

        <div className="slider-group">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Thang màu xám</label>
            <label>{adjustmentData.grey_scale}</label>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={adjustmentData.grey_scale}
            onChange={(e) => setGreyScale(e.target.value)}
          />
        </div>

        <div className="slider-group">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Hiệu ứng cổ điển</label>
            <label>{adjustmentData.sepia}</label>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={adjustmentData.sepia}
            onChange={(e) => setSepia(e.target.value)}
          />
        </div>

        <div className="slider-group">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Đảo ngược màu</label>
            <label>{adjustmentData.invert}</label>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={adjustmentData.invert}
            onChange={(e) => setInvert(e.target.value)}
          />
          </div>
        <div className="slider-group">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Mờ</label>
            <label>{adjustmentData.blur}</label>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={adjustmentData.blur}
            onChange={(e) => setBlur(e.target.value)}
          />
          </div>
      </div>

      <div className="bottom-content">
        <div className="action-btn">
          <button id="filter-action-cancel" onClick={resetAdjustmentData}>
            Hủy
          </button>
          {isProcessing ? (
            <button
              id="filter-action-apply"
              disabled
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FaSpinner className="removebg-icon spinner" /> Áp dụng
            </button>
          ) : (
            <button id="filter-action-apply" onClick={handleAdjustment}>
              Áp dụng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterVideo;
