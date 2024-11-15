// VideoContext.jsx

import React, { createContext, useState, useRef } from "react";

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const videoRef = useRef(null);

  const [history, setHistory] = useState([]); // History of video states
  const [currentIndex, setCurrentIndex] = useState(0); // Current history index
  const [videoParameters, setVideoParameters] = useState(null);
  const [mode, setMode] = useState("");

  const [adjustmentData, setAdjustmentData] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    grey_scale: 0,
    sepia: 0,
    invert: 0,
    blur: 0,
  });

  const [subtitlesFile, setSubtitlesFile] = useState(null); // State to store subtitle file

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
      grey_scale: 0,
      sepia: 0,
      invert: 0,
      blur: 0,
    });
  };

  // Hàm handleAdjustment để áp dụng các điều chỉnh cho video
  const handleAdjustment = async () => {
    if (!currentVideo) {
      console.error("Không có video để chỉnh sửa");
      return;
    }

    // Log giá trị của bộ lọc để kiểm tra trước khi áp dụng
    console.log("Giá trị bộ lọc hiện tại:", adjustmentData);

    const formData = new FormData();
    formData.append("video", currentVideo);
    formData.append("adjustmentData", JSON.stringify(adjustmentData));

    try {
      setIsProcessing(true);
      const response = await fetch("http://localhost:5000/apply-adjustment", {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Nhận video đã chỉnh sửa từ backend
        const blob = await response.blob();
        const adjustedVideoFile = new File([blob], 'adjusted_video.mp4', { type: blob.type });

        // Cập nhật lịch sử video
        const updatedHistory = [...history.slice(0, currentIndex + 1), adjustedVideoFile];
        setHistory(updatedHistory);
        setCurrentIndex(updatedHistory.length - 1);

        // Reset dữ liệu điều chỉnh
        setAdjustmentData({
          brightness: 100,
          contrast: 100,
          saturation: 100,
          hue: 0,
          grey_scale: 0,
          sepia: 0,
          invert: 0,
          blur: 0,
        });

        alert("Đã áp dụng điều chỉnh thành công!");
      } else {
        const errorData = await response.json();
        console.error("Failed to apply adjustments:", errorData);
        alert("Đã xảy ra lỗi khi áp dụng điều chỉnh: " + (errorData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error applying adjustments:", error);
      alert("Đã xảy ra lỗi khi áp dụng điều chỉnh: " + error.message);
    } finally {
      setIsProcessing(false);
    }
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

  // Get currentVideo from history or null if no video
  const currentVideo =
    history.length > 0 && currentIndex !== -1 ? history[currentIndex] : null;

  // Function to set the initial video
  const setInitialVideo = (videoFile) => {
    setHistory([videoFile]); // Initialize history with the new video
    setCurrentIndex(0); // Set currentIndex to 0
    setSubtitlesFile(null); // Reset subtitles when loading a new video
  };

  const handleDownload = ({ videoName, videoFormat }) => {
    const link = document.createElement("a");

    // Handle file name and format
    const fileName = `${videoName || "edited-video"}.${videoFormat}`;
    link.download = fileName;

    let videoSrc;
    if (currentVideo instanceof File) {
      videoSrc = URL.createObjectURL(currentVideo);
    } else if (typeof currentVideo === 'string') {
      videoSrc = currentVideo;
    } else {
      videoSrc = "";
    }

    link.href = videoSrc;
    link.click();

    // Revoke blob URL if necessary
    if (currentVideo instanceof File) {
      URL.revokeObjectURL(videoSrc);
    }
  };

  // State and initialization for FFmpeg
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleApplySubtitles = async () => {
    if (!currentVideo || !subtitlesFile) {
      alert("Vui lòng tải lên video và phụ đề trước khi áp dụng.");
      return;
    }

    console.log("currentVideo:", currentVideo);
    console.log("subtitlesFile:", subtitlesFile);

    const formData = new FormData();
    formData.append("video", currentVideo);
    formData.append("subtitles", subtitlesFile);

    try {
      setIsProcessing(true);
      const response = await fetch("http://localhost:5000/merge-video", {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Receive merged video file from backend
        const blob = await response.blob();
        const mergedVideoFile = new File([blob], 'merged_video.mp4', { type: blob.type });
        setHistory([...history, mergedVideoFile]); // Add new video to history
        setCurrentIndex(history.length); // Update current index
        alert("Đã hợp nhất phụ đề thành công!");
      } else {
        const errorData = await response.json();
        console.error("Failed to merge subtitles:", errorData);
        alert("Đã xảy ra lỗi khi hợp nhất phụ đề: " + (errorData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error applying subtitles:", error);
      alert("Đã xảy ra lỗi khi hợp nhất phụ đề: " + error.message);
    } finally {
      setIsProcessing(false);
    }
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
        handleAdjustment, // Optional: may not be needed

        updateAdjustmentData,
        resetAdjustmentData,
        setVideoParameters,
        handleDownload,
        mode,
        setMode,
        subtitlesFile, // Add to context
        setSubtitlesFile, // Add to context
        handleApplySubtitles, // Add handleApplySubtitles to context
        isProcessing, // Add processing state
        progress, // Add progress state
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
