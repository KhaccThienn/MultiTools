// VideoDisplay.jsx

import React, { useRef, useContext, useEffect } from "react";
import { VideoContext } from "@/context/VideoContext";

const VideoDisplay = ({ mode }) => {
  const {
    currentVideo,
    videoRef,
    adjustmentData,
    setVideoParameters,
    subtitlesFile,
  } = useContext(VideoContext);

  const videoDisplayRef = useRef(null);

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
  }, [currentVideo]);

  return (
    <div
      ref={videoDisplayRef}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: "10px",
        margin: "auto",
        position: "relative",
        overflow: "visible",
      }}
    >
      {currentVideo ? (
        <video
          ref={videoRef}
          src={currentVideo}
          controls
          width="100%"
          height="100%"
          style={{
            filter: `
              brightness(${adjustmentData.brightness}%)
              contrast(${adjustmentData.contrast}%)
              saturate(${adjustmentData.saturation}%)
              hue-rotate(${adjustmentData.hue}deg)
            `,
          }}
        >
          {subtitlesFile && (
            <track
              kind="subtitles"
              src={subtitlesFile}
              srcLang="vi"
              label="Vietnamese"
              default
            />
          )}
          Your browser does not support the video tag.
        </video>
      ) : (
        <div style={{ color: "#fff" }}>Vui lòng tải lên video</div>
      )}
    </div>
  );
};

export default VideoDisplay;
