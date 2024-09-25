import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../app/globals.css";
import MenuEditor from "@/components/MenuEditor";
import FooterEditor from "@/components/FooterEditor";
import ImageDisplay from "@/components/ImageDisplay";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ImageProvider } from "@/context/ImageContext";
import { CropProvider } from "@/context/CropContext";
import ImageUploader from "@/components/ImageUploader";

export default function ImageEditorPage() {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });

  const [mode, setMode] = useState('');  // State để quản lý mode

  const handleMode = (mode) => {
    setMode(mode);  // Nhận giá trị mode từ MenuEditor
    console.log("Mode selected:", mode);  // Kiểm tra xem mode có được cập nhật chính xác không
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpdate = (newImage) => {
    setImage(newImage);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <ImageProvider>
      <CropProvider>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Phần header */}
        <div style={{ display: "flex", flex: 1 }}>
          {/* Phần bên trái */}
          <div style={{ width: "400px", borderWidth: "1px", borderColor: "black" }}>
            <MenuEditor
              image={image}
              onImageUpdate={handleImageUpdate}
              imageData={imageData}
              onMode={handleMode}  // Truyền hàm handleMode xuống MenuEditor
            />
          </div>
          {/* Phần còn lại */}
          <div style={{ flex: 1, backgroundColor: '#2e2e2e' }}>
            <ImageDisplay imageSrc={selectedImage} mode={mode} altText="Selected Image"/>
          </div>
        </div>
        {/* Phần dưới cùng */}
        <div style={{ height: "50px", display: "flex", backgroundColor: "#292c31" }}>
          <ImageUploader handleImageUpload={handleImageUpload} />
          <FooterEditor />
        </div>
      </div>
      </CropProvider>
    </ImageProvider>
  );
}
