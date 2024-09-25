import { root } from "postcss";
import React, { createContext, useState, useRef } from "react";

export const CropContext = createContext();

export const CropProvider = ({ children }) => {
  const cropperRef = useRef(null);

  const defaultCropBoxData = {
    width: 100,
    height: 100,
    rotate: 0,
    flipHorizontal: false,
    flipVertical: false,
  };

  const [cropBoxData, setCropBoxData] = useState(defaultCropBoxData);
  const [croppedImage, setCroppedImage] = useState(null); // Lưu trữ ảnh đã cắ

  // Hàm cập nhật giá trị vùng crop
  const updateCropBoxData = (name, value) => {
    setCropBoxData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Hàm reset để đưa trạng thái về mặc định
  const resetCropBoxData = () => {
    setCropBoxData(defaultCropBoxData);
    setCroppedImage(null); // Xóa ảnh cũ khi nhấn hủy
  };

  // Hàm áp dụng thay đổi và cắt ảnh
  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas(); // Lấy canvas của ảnh đã crop
      if (croppedCanvas) {
        const croppedImageURL = croppedCanvas.toDataURL("image/jpeg"); // Lấy URL của ảnh
        setCroppedImage(croppedImageURL); // Lưu URL của ảnh đã cắt vào state
      }
    }
  };

  return (
    <CropContext.Provider
      value={{
        cropBoxData,
        updateCropBoxData,
        resetCropBoxData,
        handleCrop,
        croppedImage, // Ảnh đã cắt để hiển thị
        cropperRef, // Tham chiếu đến cropper
      }}
    >
      {children}
    </CropContext.Provider>
  );
};
