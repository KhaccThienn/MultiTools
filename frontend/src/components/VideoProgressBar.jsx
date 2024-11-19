// VideoProgressBar.jsx

import React, { useRef, useEffect, useState, useContext } from "react";
import { VideoContext } from "@/context/VideoContext";
import styles from "../css/VideoProgressBar.module.css";

const VideoProgressBar = ({ thumbnails = [] }) => {
  const { videoRef, trimVideo } = useContext(VideoContext);
  const [progress, setProgress] = useState(0); // Current progress percentage
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00");
  const [durationDisplay, setDurationDisplay] = useState("00:00");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [trimStart, setTrimStart] = useState(0); // Trim start time in seconds
  const [trimEnd, setTrimEnd] = useState(0); // Trim end time in seconds
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverThumbnail, setHoverThumbnail] = useState(null);

  const progressBarRef = useRef(null);
  const thumbRef = useRef(null);
  const trimStartRef = useRef(null);
  const trimEndRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration && !isDragging) {
        let currentTime = video.currentTime;
        // Clamp currentTime within trimStart and trimEnd
        if (currentTime < trimStart) {
          video.currentTime = trimStart;
          return;
        }
        if (currentTime > trimEnd) {
          video.pause();
          setIsPlaying(false);
          video.currentTime = trimEnd;
          return;
        }

        const percentage = ((currentTime - trimStart) / (trimEnd - trimStart)) * 100;
        setProgress(percentage);
        setCurrentTimeDisplay(formatTime(currentTime));
      }
    };

    const handleLoadedMetadata = () => {
      setDurationDisplay(formatTime(video.duration));
      setTrimEnd(video.duration);
      setProgress(0);
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
      video.currentTime = Math.max(video.duration - 0.1, 0);
    };

    const handleSeeked = () => {
      handleTimeUpdate();
      if (!video.paused && !video.ended) {
        setIsPlaying(true);
      }
    };

    const handleTimeUpdateBound = handleTimeUpdate.bind(this);

    video.addEventListener("timeupdate", handleTimeUpdateBound);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdateBound);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [videoRef, isDragging, trimStart, trimEnd]);

  const handleProgressBarClick = (e) => {
    const video = videoRef.current;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const clickPercentage = clickPosition / rect.width;
    const newTime = trimStart + clickPercentage * (trimEnd - trimStart);

    console.log("Progress bar clicked. New time:", newTime);

    if (isFinite(newTime) && newTime >= trimStart && newTime <= trimEnd) {
      video.currentTime = newTime;
    } else {
      console.error('Invalid newTime:', newTime);
    }
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video.paused || video.ended) {
      // If starting playback, ensure it starts from trimStart
      if (video.currentTime < trimStart || video.currentTime > trimEnd) {
        video.currentTime = trimStart;
      }
      video.play();
    } else {
      video.pause();
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

  // Handle drag for playhead thumb
  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleDragging);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragging);
    document.addEventListener('touchend', handleDragEnd);
  };

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
    const newTime = trimStart + dragPercentage * (trimEnd - trimStart);

    if (isFinite(newTime) && newTime >= trimStart && newTime <= trimEnd) {
      setProgress(dragPercentage * 100);
      setCurrentTimeDisplay(formatTime(newTime));
      video.currentTime = newTime;
    }
  };

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
      video.currentTime = Math.max(video.currentTime - 15, trimStart);
    }
  };

  // Forward 15 seconds
  const handleForward15 = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.min(video.currentTime + 15, trimEnd);
    }
  };

  // Trimming Handlers
  // Trim Start
  const handleTrimStartDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleTrimStartDragging);
    document.addEventListener('mouseup', handleTrimStartDragEnd);
    document.addEventListener('touchmove', handleTrimStartDragging);
    document.addEventListener('touchend', handleTrimStartDragEnd);
  };

  const handleTrimStartDragging = (e) => {
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
    const newTrimStart = dragPercentage * video.duration;

    // Ensure trimStart is less than trimEnd
    if (newTrimStart < trimEnd - 1) { // Minimum 1 second gap
      setTrimStart(newTrimStart);
      // If currentTime is before new trimStart, move it to trimStart
      if (video.currentTime < newTrimStart) {
        video.currentTime = newTrimStart;
      }
    }
  };

  const handleTrimStartDragEnd = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleTrimStartDragging);
    document.removeEventListener('mouseup', handleTrimStartDragEnd);
    document.removeEventListener('touchmove', handleTrimStartDragging);
    document.removeEventListener('touchend', handleTrimStartDragEnd);
  };

  // Trim End
  const handleTrimEndDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleTrimEndDragging);
    document.addEventListener('mouseup', handleTrimEndDragEnd);
    document.addEventListener('touchmove', handleTrimEndDragging);
    document.addEventListener('touchend', handleTrimEndDragEnd);
  };

  const handleTrimEndDragging = (e) => {
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
    const newTrimEnd = dragPercentage * video.duration;

    // Ensure trimEnd is greater than trimStart
    if (newTrimEnd > trimStart + 1) { // Minimum 1 second gap
      setTrimEnd(newTrimEnd);
      // If currentTime is after new trimEnd, move it to trimEnd
      if (video.currentTime > newTrimEnd) {
        video.currentTime = newTrimEnd;
      }
    }
  };

  const handleTrimEndDragEnd = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleTrimEndDragging);
    document.removeEventListener('mouseup', handleTrimEndDragEnd);
    document.removeEventListener('touchmove', handleTrimEndDragging);
    document.removeEventListener('touchend', handleTrimEndDragEnd);
  };

  // Calculate trim positions as percentages
  const getTrimStartPosition = () => {
    const video = videoRef.current;
    if (!video || !isFinite(video.duration)) return 0;
    return (trimStart / video.duration) * 100;
  };

  const getTrimEndPosition = () => {
    const video = videoRef.current;
    if (!video || !isFinite(video.duration)) return 100;
    return (trimEnd / video.duration) * 100;
  };

  // Thumbnail Hover Handlers
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

  const handleTrim = () => {
    if (trimEnd - trimStart < 1) {
      alert("Khoảng trim phải ít nhất 1 giây.");
      return;
    }
    trimVideo(trimStart, trimEnd);
  };

  return (
    <div className={styles.controlsContainer}>
      <div className={styles.buttonGroup}>
        {/* Rewind 15 Seconds */}
        <button
          className={styles.rewindButton}
          onClick={handleRewind15}
          aria-label="Rewind 15 seconds"
        >
          <i className="fas fa-undo-alt"></i> -15s
        </button>

        {/* Play/Pause */}
        <button
          className={styles.playPauseButton}
          onClick={handlePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <i className="fas fa-pause"></i>
          ) : (
            <i className="fas fa-play"></i>
          )}
        </button>

        {/* Forward 15 Seconds */}
        <button
          className={styles.forwardButton}
          onClick={handleForward15}
          aria-label="Forward 15 seconds"
        >
          +15s <i className="fas fa-redo-alt"></i>
        </button>

        {/* Trim Button */}
        <button
          className={styles.trimButton}
          onClick={handleTrim}
          aria-label="Trim Video"
          disabled={trimEnd - trimStart < 1} // Disable if trim region is less than 1 second
        >
          Trim
        </button>
      </div>
      <div className={styles.progressAndTrimContainer}>
        {/* Progress Bar with Trimming and Thumbnails */}
        <div
          className={styles.progressBarContainer}
          onClick={handleProgressBarClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          ref={progressBarRef}
        >
          {/* Thumbnails as Background */}
          {thumbnails.length > 0 && (
            <div className={styles.thumbnailsBackground}>
              {thumbnails.map((thumbnail, index) => (
                <img
                  key={index}
                  src={thumbnail.src}
                  alt={`Thumbnail ${index}`}
                  className={styles.thumbnailImage}
                  style={{ left: `${(thumbnail.time / videoRef.current.duration) * 100}%` }}
                />
              ))}
            </div>
          )}

          {/* Trim Region Overlay */}
          <div
            className={styles.trimRegion}
            style={{
              left: `${getTrimStartPosition()}%`,
              width: `${getTrimEndPosition() - getTrimStartPosition()}%`
            }}
          ></div>

          {/* Progress Indicator */}
          <div
            className={`${styles.progressIndicator} ${isDragging ? styles.dragging : ''}`}
            style={{ width: `${progress}%` }}
          ></div>

          {/* Playhead Thumb */}
          <div
            className={styles.thumb}
            style={{ left: `${progress}%` }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            ref={thumbRef}
          ></div>

          {/* Trim Start Handle */}
          <div
            className={styles.trimHandle}
            style={{ left: `${getTrimStartPosition()}%` }}
            onMouseDown={handleTrimStartDragStart}
            onTouchStart={handleTrimStartDragStart}
            ref={trimStartRef}
          ></div>

          {/* Trim End Handle */}
          <div
            className={styles.trimHandle}
            style={{ left: `${getTrimEndPosition()}%` }}
            onMouseDown={handleTrimEndDragStart}
            onTouchStart={handleTrimEndDragStart}
            ref={trimEndRef}
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
          {formatTime(trimStart)} / {formatTime(trimEnd)}
        </div>
      </div>
    </div>
  );
};

export default VideoProgressBar;
