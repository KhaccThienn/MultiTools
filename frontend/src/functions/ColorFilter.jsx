// ColorFilter.jsx
import React, { useContext, useRef, useEffect, useState } from "react";
import { ImageContext } from "@/context/ImageContext";
import { FaTimes } from "react-icons/fa";
import "../css/menuEditor.css"; // Import your CSS styles

const ColorFilter = () => {
  const {
    currentImage,
    imageRef,
    adjustmentData,
    updateAdjustmentData,
    resetAdjustmentData,
    handleAdjustment,
  } = useContext(ImageContext);

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterIntensity, setFilterIntensity] = useState(100);

  const filters = [
    {
      name: "Sống động",
      adjustments: {
        brightness: 110,
        contrast: 110,
        saturation: 130,
        hue: 0,
        grey_scale: 0,
        sepia: 0,
        invert: 0,
        blur: 0,
      },
    },
    {
      name: "Sống động ấm",
      adjustments: {
        brightness: 110,
        contrast: 110,
        saturation: 130,
        hue: 15,
        grey_scale: 0,
        sepia: 0,
        invert: 0,
        blur: 0,
      },
    },
    {
      name: "Sống động mát",
      adjustments: {
        brightness: 110,
        contrast: 110,
        saturation: 130,
        hue: -15,
        grey_scale: 0,
        sepia: 0,
        invert: 0,
        blur: 0,
      },
    },
    {
      name: "Kịch tính",
      adjustments: {
        brightness: 90,
        contrast: 130,
        saturation: 80,
        hue: 0,
        grey_scale: 0,
        sepia: 0,
        invert: 0,
        blur: 0,
      },
    },
    {
      name: "Kịch tính ấm",
      adjustments: {
        brightness: 90,
        contrast: 130,
        saturation: 80,
        hue: 15,
        grey_scale: 0,
        sepia: 0,
        invert: 0,
        blur: 0,
      },
    },
    {
      name: "Kịch tính mát",
      adjustments: {
        brightness: 90,
        contrast: 130,
        saturation: 80,
        hue: -15,
        grey_scale: 0,
        sepia: 0,
        invert: 0,
        blur: 0,
      },
    },
    {
      name: "Đơn sắc",
      adjustments: {
        brightness: 100,
        contrast: 100,
        saturation: 0,
        hue: 0,
        grey_scale: 100,
        sepia: 0,
        invert: 0,
        blur: 0,
      },
    },
    {
      name: "Bạc đá",
      adjustments: {
        brightness: 100,
        contrast: 110,
        saturation: 0,
        hue: 0,
        grey_scale: 100,
        sepia: 20,
        invert: 0,
        blur: 0,
      },
    },
    {
      name: "Noir",
      adjustments: {
        brightness: 80,
        contrast: 120,
        saturation: 0,
        hue: 0,
        grey_scale: 100,
        sepia: 0,
        invert: 0,
        blur: 0,
      },
    },
  ];

  useEffect(() => {
    if (selectedFilter === null) {
      // Nếu không có bộ lọc được chọn, đặt lại các điều chỉnh
      resetAdjustmentData();
      return;
    }

    const defaultAdjustments = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      grey_scale: 0,
      sepia: 0,
      invert: 0,
      blur: 0,
    };

    const filterAdjustments = selectedFilter.adjustments;

    Object.keys(filterAdjustments).forEach((key) => {
      const defaultValue = defaultAdjustments[key];
      const filterValue = filterAdjustments[key];

      const scaledValue =
        defaultValue +
        (filterValue - defaultValue) * (filterIntensity / 100);

      updateAdjustmentData(key, scaledValue);
    });
  }, [selectedFilter, filterIntensity]);

  const resetFilter = () => {
    setSelectedFilter(null);
    resetAdjustmentData();
  };

  const applyFilter = () => {
    handleAdjustment();
    setSelectedFilter(null);
  };

  return (
    <div className="tool-drawer">
      <div className="tool-name">
        <div></div>
        Bộ lọc màu
        <button onClick={resetFilter} className="icon-cancel" id="icon-cancel">
          <FaTimes />
        </button>
      </div>
      <div className="splitter"></div>

      <div className="filter-grid">
        {filters.map((filter, index) => (
          <FilterItem
            key={index}
            filter={filter}
            imageRef={imageRef}
            applyFilter={() => {
              setSelectedFilter(filter);
              setFilterIntensity(100);
            }}
            isSelected={selectedFilter === filter}
          />
        ))}
      </div>

      {selectedFilter && (
        <div className="filter-intensity-slider">
          <input
            type="range"
            min="0"
            max="100"
            value={filterIntensity}
            onChange={(e) => setFilterIntensity(e.target.value)}
          />
          <span>Độ đậm của bộ lọc: {filterIntensity}%</span>
        </div>
      )}

      <div className="bottom-content">
        <div className="action-btn">
          <button id="filter-action-cancel" onClick={resetFilter}>
            Hủy
          </button>
          <button id="filter-action-apply" onClick={applyFilter}>
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterItem = ({ filter, imageRef, applyFilter, isSelected }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.src = imageRef.current.src;

    img.onload = () => {
      const width = 100;
      const height = 100;
      canvas.width = width;
      canvas.height = height;

      // Áp dụng bộ lọc
      ctx.filter = `
        brightness(${filter.adjustments.brightness}%)
        contrast(${filter.adjustments.contrast}%)
        saturate(${filter.adjustments.saturation}%)
        hue-rotate(${filter.adjustments.hue}deg)
        grayscale(${filter.adjustments.grey_scale}%)
        sepia(${filter.adjustments.sepia}%)
        invert(${filter.adjustments.invert}%)
        blur(${filter.adjustments.blur}px)
      `;

      ctx.drawImage(img, 0, 0, width, height);
    };
  }, [imageRef, filter.adjustments]);

  return (
    <div
      className={`filter-item ${isSelected ? "selected" : ""}`}
      onClick={applyFilter}
    >
      <canvas ref={canvasRef} className="filter-preview" />
      <span>{filter.name}</span>
    </div>
  );
};

export default ColorFilter;
