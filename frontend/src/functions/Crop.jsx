import axios from "axios";
import React, { useState, useRef, useEffect } from "react";

export default function Crop({ top, left, width, height }) {
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [selectedArea, setSelectedArea] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null); // Lưu ảnh đã crop
  const [image, setImage] = useState(localStorage.getItem("selectedImage")); // Lưu ảnh từ localStorage
  const imageRef = useRef(null); // Dùng để lấy tọa độ của ảnh

  useEffect(() => {
    // Cập nhật khi ảnh đã được crop lưu vào localStorage
    const updatedImage = localStorage.getItem("selectedImage");
    if (updatedImage) {
      setImage(updatedImage); // Cập nhật ảnh đã crop
    }
  }, [croppedImage]);

  const handleMouseDown = (e) => {
    // Bắt đầu quá trình chọn vùng
    const rect = imageRef.current.getBoundingClientRect();
    setStartPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const rect = imageRef.current.getBoundingClientRect();
    setCurrentPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const area = {
      x: Math.min(startPosition.x, currentPosition.x),
      y: Math.min(startPosition.y, currentPosition.y),
      width: Math.abs(currentPosition.x - startPosition.x),
      height: Math.abs(currentPosition.y - startPosition.y),
    };
    setSelectedArea(area);

    // Gọi hàm crop ảnh khi đã có tọa độ selectedArea
    if (image && area) {
      cropImage(image, area);
    }
  };

  const cropImage = async (image, area) => {
    // Tạo FormData để gửi file và tọa độ vùng crop
    const formData = new FormData();
    formData.append("image", await fetch(image).then((res) => res.blob())); // Chuyển ảnh từ base64 thành Blob
    formData.append("left", area.x);
    formData.append("top", area.y);
    formData.append("right", area.x + area.width);
    formData.append("bottom", area.y + area.height);

    try {
      const response = await axios.post(
        "http://localhost:5000/crop",
        formData,
        {
          responseType: "blob",
        }
      );
      // Nhận phản hồi là ảnh đã được crop
      const blob = await response.blob();
      const url = URL.createObjectURL(blob); // Tạo URL để hiển thị ảnh đã crop
      setProcessedImage(url);
      localStorage.setItem("selectedImage", url); // Lưu ảnh đã crop vào localStorage
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  return (
    <div>
      <div
        style={{
          position: "fixed", // Cố định vị trí tương đối với viewport
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền nửa trong suốt
          top: top, // Đặt ở đầu trang web
          left: left, // Đặt sát cạnh trái của trang web
          width: width, // Độ rộng 100% của viewport
          height: height, // Chiều cao 100% của viewport
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {image ? (
          <div
            ref={imageRef} // Dùng ref để lấy kích thước ảnh
            style={{
              position: "relative",
              display: "inline-block",
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              width: width,
              height: height,
              cursor: "crosshair",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* Vùng chọn khi người dùng kéo */}
            {isDragging && (
              <div
                style={{
                  position: "absolute",
                  border: "2px dashed #333",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  left: Math.min(startPosition.x, currentPosition.x),
                  top: Math.min(startPosition.y, currentPosition.y),
                  width: Math.abs(currentPosition.x - startPosition.x),
                  height: Math.abs(currentPosition.y - startPosition.y),
                }}
              />
            )}
            {/* Hiển thị vùng đã chọn */}
            {selectedArea && (
              <div
                style={{
                  position: "absolute",
                  border: "2px solid #0f0",
                  backgroundColor: "rgba(0, 255, 0, 0.2)",
                  left: selectedArea.x,
                  top: selectedArea.y,
                  width: selectedArea.width,
                  height: selectedArea.height,
                }}
              />
            )}
          </div>
        ) : (
          <p>Không tìm thấy image trong localStorage</p>
        )}
      </div>

      {/* Hiển thị tọa độ vùng đã chọn */}
      {selectedArea && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            backgroundColor: "#fff",
            padding: "10px",
          }}
        >
          <p>Tọa độ vùng đã chọn: {JSON.stringify(selectedArea)}</p>
        </div>
      )}
    </div>
  );
}
