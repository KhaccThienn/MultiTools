// FooterVideoEditor.jsx

import React, { useContext, useState } from "react";
import "../css/edit.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { VideoContext } from "@/context/VideoContext";
import DownloadVideo from "./DownloadVideo"; // Adjust the path if necessary

function FooterVideoEditor() {
  const { undo, redo, canUndo, canRedo } = useContext(VideoContext);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  return (
    <div className="toolbar">
      <div className="ajust-size-section">
      </div>
      <div className="undo-redo-section">
        <button className="toolbar-button" onClick={undo} disabled={!canUndo}>
          <span className="zoom-text">HOÀN TÁC</span>
          <i className="fas fa-undo icon-custom"></i>
        </button>
        <button className="toolbar-button" onClick={redo} disabled={!canRedo}>
          <i className="fas fa-redo icon-custom"></i>
          <span className="zoom-text">HOÀN LẠI</span>
        </button>
      </div>
      <button
        className="toolbar-button save-button"
        onClick={() => setShowDownloadModal(true)}
      >
        <i className="fa-solid fa-download"></i>
        <span>Lưu</span>
      </button>
      {showDownloadModal && (
        <DownloadVideo closeModal={() => setShowDownloadModal(false)} />
      )}
    </div>
  );
}

export default FooterVideoEditor;
