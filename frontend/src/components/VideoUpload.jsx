// VideoUpload.jsx

import React, { useContext } from "react";
import { VideoContext } from "@/context/VideoContext";
import { LuFileVideo } from "react-icons/lu";

const VideoUpload = () => {
  const { setInitialVideo } = useContext(VideoContext);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Truyền đối tượng File thay vì blob URL
      setInitialVideo(file);
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
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
       <LuFileVideo/>
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
