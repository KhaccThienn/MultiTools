// VideoContext.jsx

import React, { createContext, useState, useRef } from "react";

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const videoRef = useRef(null);

  const [history, setHistory] = useState([]); // Lưu trữ lịch sử các trạng thái video
  const [currentIndex, setCurrentIndex] = useState(0); // Chỉ mục trạng thái hiện tại
  const [videoParameters, setVideoParameters] = useState(null);
  const [mode, setMode] = useState("");

  const [adjustmentData, setAdjustmentData] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
  });

  const [subtitlesFile, setSubtitlesFile] = useState(null); // Thêm state để lưu tệp phụ đề

  const updateAdjustmentData = (name, value) => {
    setAdjustmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetAdjustmentData = () => {
    setAdjustmentData({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
    });
  };

  const applyEdit = (newVideo) => {
    const updatedHistory = [...history.slice(0, currentIndex + 1), newVideo];
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

  // Lấy currentVideo từ history hoặc null nếu không có video nào
  const currentVideo =
    history.length > 0 && currentIndex !== -1 ? history[currentIndex] : null;

  // Hàm để thiết lập video ban đầu
  const setInitialVideo = (videoUrl) => {
    setHistory([videoUrl]); // Khởi tạo history với video mới
    setCurrentIndex(0); // Đặt currentIndex về 0
    setSubtitlesFile(null); // Reset phụ đề khi tải video mới
  };

  const handleDownload = ({ videoName, videoFormat }) => {
    const link = document.createElement("a");

    // Xử lý tên file và định dạng
    const fileName = `${videoName || "edited-video"}.${videoFormat}`;
    link.download = fileName;

    const videoSrc = currentVideo;
    link.href = videoSrc;
    link.click();
  };

  return (
    <VideoContext.Provider
      value={{
        videoRef,
        currentVideo,
        setInitialVideo,
        undo,
        redo,
        applyEdit,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
        adjustmentData,
        updateAdjustmentData,
        resetAdjustmentData,
        setVideoParameters,
        handleDownload,
        mode,
        setMode,
        subtitlesFile, // Thêm vào context
        setSubtitlesFile, // Thêm vào context
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
