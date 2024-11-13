// VideoUpload.jsx

import React, { useContext } from "react";
import { VideoContext } from "@/context/VideoContext";

const VideoUpload = () => {
  const { setInitialVideo } = useContext(VideoContext);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);

      // Cập nhật video trong VideoContext
      setInitialVideo(videoUrl);
    }
  };

  return (
    <div style={{ margin: "auto" }}>
      <label
        htmlFor="video"
        style={{
          color: "whitesmoke",
          padding: "12px 16px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        <i className="fa-regular fa-video" style={{ padding: "0 5px" }}></i>
        Thêm video
      </label>
      <input
        type="file"
        id="video"
        accept="video/*"
        onChange={handleVideoUpload}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default VideoUpload;
