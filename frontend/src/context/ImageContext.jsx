import React, { createContext, useState, useRef, useEffect  } from "react";
import axios from 'axios'; // Import axios

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
// Trong ImageContext.jsx hoặc file tương tự

const handleRemoveBackground = async () => {
  const imageDataUrl = currentImage;
  if (!imageDataUrl) {
    console.error("Không có hình ảnh để xử lý");
    return;
  }

  // Hàm chuyển đổi Blob URL thành chuỗi base64
  const getBase64FromUrl = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  try {
    const imageBase64 = await getBase64FromUrl(imageDataUrl);
    const imageBase64WithoutPrefix = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    // Gửi yêu cầu tới server để xóa nền
    const response = await axios.post('http://localhost:5000/remove-background', {
      image: imageBase64WithoutPrefix,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { output_image } = response.data;

    // Cập nhật hình ảnh trong state
    const updatedHistory = [...history.slice(0, currentIndex + 1), output_image];
    setHistory(updatedHistory);
    setCurrentIndex(updatedHistory.length - 1);
  } catch (error) {
    console.error("Lỗi khi xóa nền hình ảnh:", error.response?.data?.error || error.message);
  }
};


    // Hàm cập nhật cropBoxData từ cropper khi người dùng thay đổi vùng crop
    const updateCropBoxDataFromCropper = (data) => {
      setCropBoxData((prevData) => ({
        ...prevData,
        width: data.width,
        height: data.height,
        rotate: data.rotate || 0,
        flipHorizontal: data.scaleX < 0,
        flipVertical: data.scaleY < 0,
      }));
    };

  // Hàm xử lý sự kiện cropend
  const handleCropEnd = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const data = cropper.getData();
      updateCropBoxDataFromCropper(data);
    }
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
  // Hàm để thiết lập hình ảnh ban đầu
  const setInitialImage = (imageUrl) => {
    setHistory([imageUrl]); // Khởi tạo history với hình ảnh mới
    setCurrentIndex(0); // Đặt currentIndex về 0
  };
  

  return (
    <ImageContext.Provider
      value={{
        cropBoxData,
        updateCropBoxData,
        resetCropBoxData,
        handleCrop,
        currentImage, // Ảnh đã cắt để hiển thị
        cropperRef, // Tham chiếu đến cropper
        handleCropEnd, // Hàm xử lý sự kiện cropend
        undo, redo, applyEdit, canUndo: currentIndex > 0, canRedo: currentIndex < history.length - 1,
        handleRemoveBackground,
        setInitialImage, // Thêm hàm này vào context
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
