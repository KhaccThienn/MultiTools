import React, { useContext } from 'react';
import { ImageContext } from '@/context/ImageContext';

const ImageUploader = () => {

  const { setInitialImage } = useContext(ImageContext);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      // Cập nhật hình ảnh trong ImageContext
      setInitialImage(imageUrl);
    }
  };

  return (
    <div
    style={{
      margin:'auto'
    }}>
      <label
        htmlFor="image"
        style={{
          color: 'whitesmoke',
          padding: '12px 16px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        <i className="fa-regular fa-image" style={{ padding: '0 5px' }}></i>
        Thêm ảnh
      </label>
      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUploader;
