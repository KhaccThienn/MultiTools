// ColorFilter.jsx
import React, { useContext, useRef, useEffect } from "react";
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

  const filters = [
    {
      name: "Sepia",
      adjustments: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hue: 0,
        grey_scale: 0,
        sepia: 100,
        invert: 0,
        blur: 0,
      },
    },
    {
      name: "Vintage",
      adjustments: {
        brightness: 90,
        contrast: 110,
        saturation: 120,
        hue: -10,
        grey_scale: 0,
        sepia: 50,
        invert: 0,
        blur: 0,
      },
    },
    {
      name: "Black & White",
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
      name: "Invert",
      adjustments: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hue: 0,
        grey_scale: 0,
        sepia: 0,
        invert: 100,
        blur: 0,
      },
    },

    // Add more filters as needed
  ];

  const applyFilter = (filterAdjustments) => {
    // Update all adjustmentData with the filter's adjustments
    Object.keys(filterAdjustments).forEach((key) => {
      updateAdjustmentData(key, filterAdjustments[key]);
    });
  };

  return (
    <div className="tool-drawer">
      <div className="tool-name">
        <div></div>
        Bộ lọc màu
        <button onClick={{}} className="icon-cancel" id="icon-cancel">
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
            applyFilter={applyFilter}
          />
        ))}
      </div>

      <div className="bottom-content">
        <div className="action-btn">
          <button id="filter-action-cancel" onClick={resetAdjustmentData}>
            Hủy
          </button>
          <button id="filter-action-apply" onClick={handleAdjustment}>
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterItem = ({ filter, imageRef, applyFilter }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "Anonymous"; // Important for CORS

    img.src = imageRef.current.src;

    img.onload = () => {
      const width = 100;
      const height = 100;
      canvas.width = width;
      canvas.height = height;

      // Apply filters
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
      className="filter-item"
      onClick={() => applyFilter(filter.adjustments)}
    >
      <canvas ref={canvasRef} className="filter-preview" />
      <span>{filter.name}</span>
    </div>
  );
};

export default ColorFilter;
