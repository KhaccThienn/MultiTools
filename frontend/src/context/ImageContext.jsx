import React, { createContext, useState, useRef } from "react";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const cropperRef = useRef(null);
  
  const [history, setHistory] = useState([]); // Lưu trữ lịch sử các trạng thái ảnh
  const [currentIndex, setCurrentIndex] = useState(0); // Chỉ mục trạng thái hiện tại

  const defaultCropBoxData = {
    width: 100,
    height: 100,
    rotate: 0,
    flipHorizontal: false,
    flipVertical: false,
  };

  const [cropBoxData, setCropBoxData] = useState(defaultCropBoxData);
  const [croppedImage, setCroppedImage] = useState(null); // Lưu trữ ảnh đã crop

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

  const applyEdit = (newImage) => {
    const updatedHistory = [...history.slice(0, currentIndex + 1), newImage];
    setHistory(updatedHistory);
    setCurrentIndex(updatedHistory.length - 1);
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Hàm áp dụng thay đổi và cắt ảnh
  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas(); // Lấy canvas của ảnh đã crop
      if (croppedCanvas) {
        const croppedImageURL = croppedCanvas.toDataURL("image/jpeg"); // Lấy URL của ảnh
        setCroppedImage(croppedImageURL); // Lưu URL của ảnh đã cắt vào state
        const updatedHistory = [...history.slice(0, currentIndex + 1), croppedImageURL];
        setHistory(updatedHistory);
        setCurrentIndex(updatedHistory.length - 1);
      }
    }
  };

  // Lấy currentImage từ history hoặc null nếu không có ảnh nào
  const currentImage = history.length > 0 && currentIndex !== -1 ? history[currentIndex] : null;

  

  return (
    <ImageContext.Provider
      value={{
        cropBoxData,
        updateCropBoxData,
        resetCropBoxData,
        handleCrop,
        currentImage, // Ảnh đã cắt để hiển thị
        cropperRef, // Tham chiếu đến cropper
        undo, redo, applyEdit, canUndo: currentIndex > 0, canRedo: currentIndex < history.length - 1,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
