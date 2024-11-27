import { AudioContext } from '@/context/AudioContext';
import React, { useContext, useState } from 'react';
import "../css/edit.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function FooterAudioEditor() {
    const {undo, redo, canUndo, canRedo} = useContext(AudioContext);
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
        //   <DownloadAudio closeModal={() => setShowDownloadModal(false)} />
        <></>
        )}
      </div>
    )
}