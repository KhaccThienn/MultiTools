// components/Crop.js
import React, { useState } from 'react';

function Crop({ image, onImageUpdate }) {
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const handleCrop = async () => {
    if (!image) {
      alert('Vui lòng tải lên hình ảnh trước.');
      return;
    }

    const response = await fetch('http://localhost:5000/crop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ top, left, width, height, image }),
    });

    const data = await response.json();
    onImageUpdate(data.cropped_image);
  };

  return (
    <div>
      <h2>Crop</h2>
      <label>
        Top:
        <input type="number" value={top} onChange={(e) => setTop(e.target.value)} />
      </label>
      <label>
        Left:
        <input type="number" value={left} onChange={(e) => setLeft(e.target.value)} />
      </label>
      <label>
        Width:
        <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
      </label>
      <label>
        Height:
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
      </label>
      <button onClick={handleCrop}>Crop</button>
    </div>
  );
}

export default Crop;
