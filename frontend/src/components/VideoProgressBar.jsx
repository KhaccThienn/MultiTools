// VideoProgressBar.jsx

import React, { useRef, useEffect, useState, useContext } from "react";
import { VideoContext } from "@/context/VideoContext";
import styles from "../css/VideoProgressBar.module.css";

const VideoProgressBar = ({ thumbnails }) => {
  const { videoRef } = useContext(VideoContext);
  const [progress, setProgress] = useState(0); // Current progress percentage
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00");
  const [durationDisplay, setDurationDisplay] = useState("00:00");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverThumbnail, setHoverThumbnail] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef(null);
  const thumbRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration && !isDragging) {
        const percentage = (video.currentTime / video.duration) * 100;
        setProgress(percentage);
        setCurrentTimeDisplay(formatTime(video.currentTime));
      }
    };

    const handleLoadedMetadata = () => {
      setDurationDisplay(formatTime(video.duration));
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTimeDisplay(formatTime(video.currentTime));
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
      setCurrentTimeDisplay(formatTime(video.duration));

      // Optional: Seek slightly back to allow replay
      video.currentTime = Math.max(video.duration - 0.1, 0);
    };

    const handleSeeked = () => {
      handleTimeUpdate();
      if (!video.paused && !video.ended) {
        setIsPlaying(true);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [videoRef, isDragging]);

  const handleProgressBarClick = (e) => {
    const video = videoRef.current;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const clickPercentage = clickPosition / rect.width;
    const newTime = clickPercentage * video.duration;

    console.log("Progress bar clicked. New time:", newTime);

    if (isFinite(newTime) && newTime >= 0 && newTime <= video.duration) {
      video.currentTime = newTime;
    } else {
      console.error('Invalid newTime:', newTime);
    }
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleMouseMove = (e) => {
    const video = videoRef.current;
    if (!thumbnails || thumbnails.length === 0 || !isFinite(video.duration)) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverPosition = e.clientX - rect.left;
    const hoverPercentage = hoverPosition / rect.width;
    const hoverTimeCalculated = hoverPercentage * video.duration;
    setHoverTime(hoverTimeCalculated);

    // Determine the thumbnail index based on hover percentage
    const thumbnailIndex = Math.min(
      Math.floor(hoverPercentage * thumbnails.length),
      thumbnails.length - 1
    );
    const newHoverThumbnail = thumbnails[thumbnailIndex]?.src || null;
    setHoverThumbnail(newHoverThumbnail);

    console.log(`Mouse moved to ${hoverTimeCalculated}s, thumbnail:`, newHoverThumbnail);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setHoverTime(null);
      setHoverThumbnail(null);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const minsString = mins < 10 ? `0${mins}` : `${mins}`;
    const secsString = secs < 10 ? `0${secs}` : `${secs}`;
    return `${minsString}:${secsString}`;
  };

  // Handle drag start
  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleDragging);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragging);
    document.addEventListener('touchend', handleDragEnd);
  };

  // Handle dragging
  const handleDragging = (e) => {
    const video = videoRef.current;
    if (!video) return;

    let clientX;

    if (e.type.startsWith('touch')) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const rect = progressBarRef.current.getBoundingClientRect();
    let dragPosition = clientX - rect.left;

    // Clamp dragPosition within the progress bar
    dragPosition = Math.max(0, Math.min(dragPosition, rect.width));

    const dragPercentage = dragPosition / rect.width;
    const newTime = dragPercentage * video.duration;

    if (isFinite(newTime) && newTime >= 0 && newTime <= video.duration) {
      setProgress(dragPercentage * 100);
      setCurrentTimeDisplay(formatTime(newTime));
      video.currentTime = newTime;
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleDragging);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDragging);
    document.removeEventListener('touchend', handleDragEnd);
  };

  // Rewind 15 seconds
  const handleRewind15 = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(video.currentTime - 15, 0);
    }
  };

  // Forward 15 seconds
  const handleForward15 = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.min(video.currentTime + 15, video.duration);
    }
  };

  // Calculate thumbnail position as percentage
  const getThumbnailPosition = (thumbnailTime) => {
    const video = videoRef.current;
    if (!video || !isFinite(video.duration)) return 0;
    return (thumbnailTime / video.duration) * 100;
  };

  return (
    <div className={styles.controlsContainer}>
      <div className={styles.buttonGroup}>
        {/* Rewind 15 Seconds */}
        <button className={styles.rewindButton} onClick={handleRewind15} aria-label="Rewind 15 seconds">
          <i className="fas fa-undo-alt"></i> -15s
        </button>

        {/* Play/Pause */}
        <button className={styles.playPauseButton} onClick={handlePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? (
            <i className="fas fa-pause"></i>
          ) : (
            <i className="fas fa-play"></i>
          )}
        </button>

        {/* Forward 15 Seconds */}
        <button className={styles.forwardButton} onClick={handleForward15} aria-label="Forward 15 seconds">
          +15s <i className="fas fa-redo-alt"></i>
        </button>
      </div>
      <div className={styles.progressAndThumbnailsContainer}>
        {/* Combined Progress Bar with Thumbnails */}
        <div
          className={styles.progressBarContainer}
          onClick={handleProgressBarClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          ref={progressBarRef}
        >
          {/* Thumbnails as Background */}
          <div className={styles.thumbnailsBackground}>
            {thumbnails.map((thumbnail, index) => (
              <img
                key={index}
                src={thumbnail.src}
                alt={`Thumbnail ${index}`}
                className={styles.thumbnailImage}
                style={{ left: `${getThumbnailPosition(thumbnail.time)}%` }}
              />
            ))}
          </div>

          {/* Current Progress Indicator */}
          <div
            className={`${styles.progressIndicator} ${isDragging ? styles.dragging : ''}`}
            style={{ width: `${progress}%` }}
          ></div>

          {/* Draggable Thumb */}
          <div
            className={styles.thumb}
            style={{ left: `${progress}%` }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            ref={thumbRef}
          ></div>

          {/* Thumbnail Preview on Hover */}
          {hoverThumbnail && (
            <div
              className={`${styles.thumbnailPreview} ${hoverThumbnail ? styles.visible : ''}`}
              style={{ left: `${(hoverTime / videoRef.current.duration) * 100}%` }}
            >
              <img src={hoverThumbnail} alt="Thumbnail preview" />
            </div>
          )}
        </div>

        {/* Time Display */}
        <div className={styles.timeDisplay}>
          {currentTimeDisplay} / {durationDisplay}
        </div>
      </div>
    </div>
  );
};

export default VideoProgressBar;
