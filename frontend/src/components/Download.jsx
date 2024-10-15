import React, { useContext, useState } from "react";
import { ImageContext } from "@/context/ImageContext";
import "../css/app.css";

const Download = ({ closeModal }) => {
  const [imageName, setImageName] = useState("edited-image");
  const [imageFormat, setImageFormat] = useState("jpeg");
  const { handleDownload } = useContext(ImageContext);

  const handleDownloadClick = () => {
    console.log('Image Name:', imageName);
    console.log('Image Format:', imageFormat);
    handleDownload({ imageName, imageFormat });
    closeModal();
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Tải ảnh xuống</h2>

        <div className="form-group">
          <label htmlFor="imageName">Tên ảnh:</label>
          <input
            id="imageName"
            type="text"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            placeholder="Nhập tên ảnh"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageFormat">Định dạng ảnh:</label>
          <select
            id="imageFormat"
            value={imageFormat}
            onChange={(e) => setImageFormat(e.target.value)}
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>

        <div className="modal-actions">
          <button className="button download-button" onClick={handleDownloadClick}>
            <i className="fa fa-download"></i> Tải xuống
          </button>
          <button className="button close-button" onClick={closeModal}>
            <i className="fa fa-times"></i> Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Download;
