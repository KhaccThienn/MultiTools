import React, { useState } from "react";
import "../app/globals.css";
import MenuVideoEditor from "../components/MenuVideoEditor";
import FooterVideoEditor from "../components/FooterVideoEditor";
import VideoDisplay from "../components/VideoDisplay";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { VideoProvider } from "../context/VideoContext";
import VideoUpload from "../components/VideoUpload";

export default function VideoEditorPage() {
  const [mode, setMode] = useState("");

  const handleMode = (mode) => {
    setMode(mode);
    console.log("Mode selected:", mode);
  };

  return (
    <VideoProvider>
      <title>MultiTools | Công cụ chỉnh sửa đa năng</title>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Menu + Display */}
        <div style={{ display: "flex", flex: 1 }}>
          {/* Menu */}
          <div style={{ width: "22em", backgroundColor: "#2e2e2e" }}>
            <MenuVideoEditor onMode={handleMode} />
          </div>
          {/* Display */}
          <div style={{ flex: 1, backgroundColor: "#2e2e2e", position: "relative", overflow: "hidden" }}>
            <VideoDisplay mode={mode} />
          </div>
        </div>
        {/* Footer */}
        <div style={{ display: "flex", height: "10vh", backgroundColor: "#292c31" }}>
          <VideoUpload />
          <FooterVideoEditor />
        </div>
      </div>
    </VideoProvider>
  );
}
