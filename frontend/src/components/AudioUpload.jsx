// VideoUpload.jsx

import React, { useContext } from "react";
import { LuFileAudio } from "react-icons/lu";
import { AudioContext } from "@/context/AudioContext";

const AudioUpload = () => {
  const { setInitialAudio } = useContext(AudioContext);

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Truyền đối tượng File thay vì blob URL
      setInitialAudio(file);
    }
  };

  return (
    <div style={{ margin: "auto" }}>
      <label
        htmlFor="audio"
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
       <LuFileAudio/>
        Thêm Audio
      </label>
      <input
        type="file"
        id="audio"
        accept="audio/*"
        onChange={handleAudioUpload}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default AudioUpload;
