import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function Crop() {
  const [crop, setCrop] = useState({ aspect: 1 }); // Tỉ lệ khung cắt ảnh
  const [image, setImage] = useState(null); // Lưu ảnh đã chọn
  const [croppedImage, setCroppedImage] = useState(null); // Lưu ảnh sau khi crop

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (crop) => {
    // Hàm này được gọi khi crop hoàn thành
    makeCroppedImage(crop);
  };

  const makeCroppedImage = async (crop) => {
    if (!image || !crop.width || !crop.height) return;

    const imageElement = document.createElement('img');
    imageElement.src = image;

    await new Promise((resolve) => {
      imageElement.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const scaleX = imageElement.naturalWidth / imageElement.width;
    const scaleY = imageElement.naturalHeight / imageElement.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      imageElement,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const base64Image = canvas.toDataURL('image/jpeg');
    setCroppedImage(base64Image);
  };

  return (
    <div>
      <h2>Chọn và crop ảnh</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && (
        <>
          <ReactCrop
            src={image}
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={onCropComplete}
          />
        </>
      )}

      {croppedImage && (
        <>
          <h3>Ảnh đã crop:</h3>
          <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%' }} />
        </>
      )}
    </div>
  );
}
