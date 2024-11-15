// VideoDisplay.jsx

import React, { useRef, useContext, useEffect, useState } from "react";
import { VideoContext } from "@/context/VideoContext";
import styles from "../css/VideoDisplay.module.css";
import InputFile from "./InputFile";
import VideoProgressBar from "./VideoProgressBar";

const VideoDisplay = ({ mode }) => {
  const {
    currentVideo,
    videoRef,
    adjustmentData,
    setVideoParameters,
    subtitlesFile,
    setInitialVideo,
  } = useContext(VideoContext);

  const [videoUrl, setVideoUrl] = useState(null);
  const [subtitlesUrl, setSubtitlesUrl] = useState(null);
  const [thumbnails, setThumbnails] = useState([]); // State for thumbnails

  const videoDisplayRef = useRef(null);
  const hiddenVideoRef = useRef(null); // Hidden video for thumbnail generation

  // Convert currentVideo or URL to videoUrl
  useEffect(() => {
    if (currentVideo) {
      if (currentVideo instanceof File) {
        const url = URL.createObjectURL(currentVideo);
        setVideoUrl(url);

        // Revoke URL when not needed
        return () => {
          URL.revokeObjectURL(url);
        };
      } else if (typeof currentVideo === "string") {
        setVideoUrl(currentVideo);
      }
    } else {
      setVideoUrl(null);
    }
  }, [currentVideo]);

  // Convert subtitlesFile or URL to subtitlesUrl
  useEffect(() => {
    if (subtitlesFile) {
      if (subtitlesFile instanceof File) {
        const url = URL.createObjectURL(subtitlesFile);
        setSubtitlesUrl(url);

        // Revoke URL when not needed
        return () => {
          URL.revokeObjectURL(url);
        };
      } else if (typeof subtitlesFile === "string") {
        setSubtitlesUrl(subtitlesFile);
      }
    } else {
      setSubtitlesUrl(null);
    }
  }, [subtitlesFile]);

  // Update video parameters
  useEffect(() => {
    const updateVideoParameters = () => {
      if (videoRef.current) {
        const rect = videoRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const left = rect.left + window.scrollX;
        const top = rect.top + window.scrollY;

        setVideoParameters({ width, height, left, top });
        console.log("Video Parameters:", { width, height, left, top });
      }
    };

    const handleVideoLoad = () => {
      updateVideoParameters();
    };

    if (videoRef.current) {
      if (videoRef.current.readyState >= 2) {
        updateVideoParameters();
      } else {
        videoRef.current.onloadedmetadata = handleVideoLoad;
      }

      // Cleanup
      return () => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = null;
        }
      };
    }
  }, [currentVideo, setVideoParameters, videoRef]);

  useEffect(() => {
    if (videoUrl) {
      const videoElement = hiddenVideoRef.current;
      if (!videoElement) return;
  
      let cancelled = false; // Flag to cancel ongoing tasks
  
      const handleLoadedMetadata = () => {
        const duration = videoElement.duration;
        if (!isFinite(duration) || duration <= 0) {
          console.error('Video duration is not finite or invalid:', duration);
          return;
        }
  
        const interval = 10; // Seconds between thumbnails
        const thumbnailsArray = [];
        const totalThumbnails = Math.floor(duration / interval);
        let currentTime = 0;
  
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        // Reduce canvas resolution for speed
        const canvasWidth = 160;
        const canvasHeight = 90;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
  
        const captureThumbnails = async () => {
          for (let i = 0; i < totalThumbnails; i++) {
            currentTime = i * interval;
            try {
              await new Promise((resolve, reject) => {
                const onSeeked = () => {
                  if (cancelled) {
                    videoElement.removeEventListener("seeked", onSeeked);
                    reject(new Error("Thumbnail generation cancelled"));
                    return;
                  }
  
                  ctx.drawImage(videoElement, 0, 0, canvasWidth, canvasHeight);
                  const dataURL = canvas.toDataURL("image/jpeg");
                  thumbnailsArray.push({ time: currentTime, src: dataURL });
                  videoElement.removeEventListener("seeked", onSeeked);
                  resolve();
                };
  
                videoElement.addEventListener("seeked", onSeeked);
                videoElement.currentTime = currentTime;
              });
            } catch (error) {
              console.error(`Error capturing thumbnail at ${currentTime}s:`, error);
              if (cancelled) return;
            }
          }
  
          // Capture a thumbnail near the end if not evenly divisible
          if (duration % interval !== 0) {
            currentTime = Math.max(duration - 0.1, 0);
            try {
              await new Promise((resolve, reject) => {
                const onSeeked = () => {
                  if (cancelled) {
                    videoElement.removeEventListener("seeked", onSeeked);
                    reject(new Error("Thumbnail generation cancelled"));
                    return;
                  }
  
                  ctx.drawImage(videoElement, 0, 0, canvasWidth, canvasHeight);
                  const dataURL = canvas.toDataURL("image/jpeg");
                  thumbnailsArray.push({ time: currentTime, src: dataURL });
                  videoElement.removeEventListener("seeked", onSeeked);
                  resolve();
                };
  
                videoElement.addEventListener("seeked", onSeeked);
                videoElement.currentTime = currentTime;
              });
            } catch (error) {
              console.error(`Error capturing thumbnail at ${currentTime}s:`, error);
              if (cancelled) return;
            }
          }
  
          if (!cancelled) {
            setThumbnails(thumbnailsArray);
            console.log('Thumbnails generated:', thumbnailsArray);
          }
        };
  
        captureThumbnails();
      };
  
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
  
      // Start loading the hidden video
      videoElement.load();
  
      // Cleanup
      return () => {
        cancelled = true; // Mark as cancelled
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [videoUrl]);

  return (
<div ref={videoDisplayRef} className={styles.videoContainer}>
      {videoUrl ? (
        <div className={styles.videoWrapper}>
          {/* Visible Video for User */}
          <video
            ref={videoRef}
            src={videoUrl}
            controls={false} // Hide default controls to use custom controls
            className={styles.videoElement}
            style={{
              filter: `
                  brightness(${adjustmentData.brightness}%)
                  saturate(${adjustmentData.saturation}%)
                  contrast(${adjustmentData.contrast}%)
                  hue-rotate(${adjustmentData.hue}deg)
                  grayscale(${adjustmentData.grey_scale}%)
                  sepia(${adjustmentData.sepia}%)
                  invert(${adjustmentData.invert}%)
                  blur(${adjustmentData.blur}px)
                `,
            }}
          >
            {subtitlesUrl && (
              <track
                kind="subtitles"
                src={subtitlesUrl}
                srcLang="en"
                label="English"
                default
              />
            )}
            Your browser does not support the video tag.
          </video>

          {/* Hidden Video for Thumbnail Generation */}
          <video
            ref={hiddenVideoRef}
            src={videoUrl}
            style={{ display: "none" }}
            preload="metadata" // Load metadata as soon as possible
            crossOrigin="anonymous" // Ensure CORS access if video is from a different source
          />

          {/* Integrated VideoProgressBar */}
          <VideoProgressBar thumbnails={thumbnails} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <InputFile setFile={setInitialVideo} type="Video" />
        </div>
      )}
    </div>
  );
};

export default VideoDisplay;
