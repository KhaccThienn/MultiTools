import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../app/globals.css";
import MenuEditor from "@/components/MenuEditor";
import FooterEditor from "@/components/FooterEditor";
import ImageDisplay from "@/components/ImageDisplay";
import Crop from "@/functions/Crop";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function ImageEditorPage() {
  const [image, setImage] = useState(null);

  const handleImageUpdate = (newImage) => {
    setImage(newImage);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Phần header */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Phần bên trái */}
        <div
          style={{ width: "400px", borderWidth: "1px", borderColor: "black" }}
        >
          <MenuEditor />
          {/* <Crop image={image} onImageUpdate={handleImageUpdate} /> */}
        </div>
        {/* Phần còn lại */}
        <div style={{ flex: 1 }}>
          <ImageDisplay image={image} />
        </div>
      </div>
      {/* Phần dưới cùng */}
      <div
        style={{ height: "50px", display: "flex", backgroundColor: "#292c31" }}
      >
        {/* <FooterEditor /> */}
        <label
          htmlFor="image"
          style={{
            color: "whitesmoke",
            padding: "12px 16px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          <i className="fa-regular fa-image" style={{ padding: "0 5px" }}></i>
          Thêm ảnh
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        <FooterEditor />
      </div>
    </div>
  );
}
