import React, { useContext, useEffect, useState, useRef } from "react";
import { AiOutlineRotateLeft, AiOutlineRotateRight } from "react-icons/ai";
import { PiFlipHorizontalBold, PiFlipVerticalBold } from "react-icons/pi";
import { ImageContext } from "@/context/ImageContext";

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

function Crop({ image, onImageUpdate }) {
  const { imageData } = useContext(ImageContext);
  const [borderBox, setBorderBox] = useState({
    width: imageData?.width || 100,
    height: imageData?.height || 100,
    top: imageData?.top || 50,
    left: imageData?.left || 50,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentHandle, setCurrentHandle] = useState(null);
  const startPosition = useRef({ x: 0, y: 0 });

  const getClientPos = (e) => {
    if (e.touches) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleStart = (e, type, handle = null) => {
    e.preventDefault();
    const { x, y } = getClientPos(e);
    if (type === "drag") {
      setIsDragging(true);
      startPosition.current = {
        x: x - borderBox.left,
        y: y - borderBox.top,
      };
    } else if (type === "resize") {
      setIsResizing(true);
      setCurrentHandle(handle);
      startPosition.current = { x, y };
    }
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);
  };

  const handleMove = (e) => {
    const { x, y } = getClientPos(e);
    if (isDragging) {
      const newX = x - startPosition.current.x;
      const newY = y - startPosition.current.y;
      setBorderBox((prev) => ({
        ...prev,
        left: newX,
        top: newY,
      }));
    } else if (isResizing && currentHandle) {
      if (currentHandle === "bottom-right") {
        const newWidth = x - startPosition.current.x;
        const newHeight = y - startPosition.current.y;
        setBorderBox((prev) => ({
          ...prev,
          width: Math.max(newWidth, 20),
          height: Math.max(newHeight, 20),
        }));
      }
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
    setCurrentHandle(null);
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", handleEnd);
    window.removeEventListener("touchmove", handleMove);
    window.removeEventListener("touchend", handleEnd);
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
              value={borderBox.width}
              onChange={(e) =>
                setBorderBox((prev) => ({ ...prev, width: +e.target.value }))
              }
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <div style={styles.inputLabel}>Chiều cao</div>
            <input
              type="number"
              value={borderBox.height}
              onChange={(e) =>
                setBorderBox((prev) => ({ ...prev, height: +e.target.value }))
              }
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Chọn khung hình</label>
            <input type="checkbox" style={{ transform: "scale(1.2)" }} />
          </div>

          <div style={styles.iconGroup}>
            <AiOutlineRotateLeft style={{ fontSize: "24px", cursor: "pointer" }} />
            <AiOutlineRotateRight style={{ fontSize: "24px", cursor: "pointer" }} />
            <PiFlipHorizontalBold style={{ fontSize: "24px", cursor: "pointer" }} />
            <PiFlipVerticalBold style={{ fontSize: "24px", cursor: "pointer" }} />
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

      {imageData && (
        <div
          style={{
            ...styles.borderBox,
            width: `${borderBox.width}px`,
            height: `${borderBox.height}px`,
            top: `${borderBox.top}px`,
            left: `${borderBox.left}px`,
          }}
          onMouseDown={(e) => handleStart(e, "drag")}
          onTouchStart={(e) => handleStart(e, "drag")}
        >
          <div
            style={{
              ...styles.resizeHandle,
              bottom: "0px",
              right: "0px",
              cursor: "nwse-resize",
            }}
            onMouseDown={(e) => handleStart(e, "resize", "bottom-right")}
            onTouchStart={(e) => handleStart(e, "resize", "bottom-right")}
          />
        </div>
      )}
    </>
  );
}

export default Crop;
