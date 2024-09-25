import React, { useContext, useEffect, useState, useRef } from "react";
import { AiOutlineRotateLeft, AiOutlineRotateRight } from "react-icons/ai";
import { PiFlipHorizontalBold, PiFlipVerticalBold } from "react-icons/pi";
import { ImageContext } from "@/context/ImageContext";
import { CropContext } from "@/context/CropContext";

const styles = {
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
  borderBox: {
    position: "absolute",
    border: "2px solid cyan",
    zIndex: 10,
    pointerEvents: "auto",
    overflow: "hidden",
  },
  resizeHandle: {
    position: "absolute",
    width: "10px",
    height: "10px",
    backgroundColor: "cyan",
    zIndex: 11,
    cursor: "nwse-resize", // Default resize cursor
  },
};

function Crop() {
  const { imageData } = useContext(ImageContext);
  const {cropBoxData, updateCropBoxData, resetCropBoxData, handleCrop  } = useContext(CropContext);

    // Hàm xử lý xoay trái
    const handleRotateLeft = () => {
      updateCropBoxData('rotate', cropBoxData.rotate - 90);
    };
  
    // Hàm xử lý xoay phải
    const handleRotateRight = () => {
      updateCropBoxData('rotate', cropBoxData.rotate + 90);
    };
  
    // Hàm xử lý lật ngang
    const handleFlipHorizontal = () => {
      updateCropBoxData('flipHorizontal', !cropBoxData.flipHorizontal);
    };
  
    // Hàm xử lý lật dọc
    const handleFlipVertical = () => {
      updateCropBoxData('flipVertical', !cropBoxData.flipVertical);
    };
 

  return (
    <>
      <div style={styles.menuDetail}>
        <div style={styles.menuTopBar}>Cắt ảnh</div>

        <div style={styles.detailBox}>
          <div style={styles.inputGroup}>
            <div style={styles.inputLabel}>Chiều rộng</div>
            <input
              type="number"
              value={cropBoxData.width}
              style={styles.input}
              onChange={(e) => updateCropBoxData('width', Number(e.target.value))}
            />
          </div>
          <div style={styles.inputGroup}>
            <div style={styles.inputLabel}>Chiều cao</div>
            <input
              type="number"
              value={cropBoxData.height}
              onChange={(e) => updateCropBoxData('height', Number(e.target.value))}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Chọn khung hình</label>
            <input type="checkbox" style={{ transform: "scale(1.2)" }} />
          </div>

          <div style={styles.iconGroup}>
            <AiOutlineRotateLeft style={{ fontSize: "24px", cursor: "pointer" }}   onClick={handleRotateLeft}/>
            <AiOutlineRotateRight style={{ fontSize: "24px", cursor: "pointer" }}  onClick={handleRotateRight}/>
            <PiFlipHorizontalBold style={{ fontSize: "24px", cursor: "pointer" }} onClick={handleFlipHorizontal}/>
            <PiFlipVerticalBold style={{ fontSize: "24px", cursor: "pointer" }}  onClick={handleFlipVertical}/>
          </div>

          <div style={styles.resizeButtons}>
            <button style={styles.resizeButton}>Image size</button>
            <button style={styles.resizeButton}>Kích thước trang</button>
            <button style={styles.resizeButton}>Smart resize</button>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.cancelButton} onClick={resetCropBoxData}>Hủy</button>
          <button style={styles.applyButton} onClick={handleCrop}>Áp dụng</button>
        </div>
      </div>

    </>
  );
}

export default Crop;
