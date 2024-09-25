import React from 'react';
import { ImageContext } from '@/context/ImageContext';

const ImageUploader = ({ handleImageUpload }) => {


  return (
    <div>
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
