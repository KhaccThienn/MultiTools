import { ImageContext } from '@/context/ImageContext';
import React, { useContext, useState } from 'react';
import '../css/app.css'
const Download = ({ closeModal }) => {
  const [imageName, setImageName] = useState("edited-image"); // Tên mặc định cho ảnh
  const [imageFormat, setImageFormat] = useState("jpeg"); // Định dạng mặc định

  const { handleDownload } = useContext(ImageContext);

  const handleDownloadClick = () => {
    handleDownload(imageName, imageFormat); // Gọi hàm download
    closeModal(); // Đóng modal sau khi tải ảnh
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Tải ảnh xuống</h2>

        {/* Input cho tên ảnh */}
        <label>
          Tên ảnh: 
          <input
            type="text"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            placeholder="Nhập tên ảnh"
          />
        </label>

        {/* Select để chọn định dạng ảnh */}
        <label>
          Định dạng ảnh: 
          <select
            value={imageFormat}
            onChange={(e) => setImageFormat(e.target.value)}
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </label>

        {/* Nút download */}
        <button onClick={handleDownloadClick}>Download Ảnh</button>

        {/* Nút đóng modal */}
        <button onClick={closeModal}>Đóng</button>
      </div>
    </div>
  );
};

export default Download;
