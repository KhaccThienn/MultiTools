import React, { useContext, useState } from "react";
import { VideoContext } from "@/context/VideoContext";
import "../css/app.css";
import { FiDownload } from "react-icons/fi";
import { CgClose } from "react-icons/cg";

const Download = ({ closeModal }) => {
  const [videoName, setVideoName] = useState("edited-video");
  const [videoFormat, setVideoFormat] = useState("mp4");
  const { handleDownload } = useContext(VideoContext);

  const handleDownloadClick = () => {
    console.log("Image Name:", videoName);
    console.log("Image Format:", videoFormat);
    handleDownload({ videoName, videoFormat });
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Tải ảnh xuống</h2>

        <div className="form-group">
          <label htmlFor="videoName">Tên ảnh:</label>
          <input
            id="videoName"
            type="text"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            placeholder="Nhập tên ảnh"
          />
        </div>

        <div className="form-group">
          <label htmlFor="videoFormat">Định dạng ảnh:</label>
          <select
            id="videoFormat"
            value={videoFormat}
            onChange={(e) => setVideoFormat(e.target.value)}
          >
            <option value="mp4">MP4</option>
          </select>
        </div>

        <div className="modal-actions">
          <button
            className="button download-button"
            onClick={handleDownloadClick}
          >
            <FiDownload /> Tải xuống
          </button>
          <button className="button close-button" onClick={closeModal}>
            <CgClose /> Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Download;
