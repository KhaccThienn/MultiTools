// components/ImageDisplay.js
import React, { useRef, useEffect, useState } from 'react';

function ImageDisplay({ image }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [initialScale, setInitialScale] = useState(1);


  

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const ctx = canvas.getContext('2d');

        // Lấy kích thước của container
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Tính toán tỷ lệ để hình ảnh vừa với container
        const hRatio = containerWidth / img.width;
        const vRatio = containerHeight / img.height;
        const ratio = Math.min(hRatio, vRatio);

        // Lưu tỷ lệ ban đầu
        setInitialScale(ratio);
        setScale(ratio);

        // Đặt kích thước canvas bằng kích thước container
        canvas.width = containerWidth;
        canvas.height = containerHeight;

        // Vẽ hình ảnh với tỷ lệ phù hợp
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        // Dịch chuyển đến vị trí trung tâm
        ctx.translate(position.x, position.y);
        ctx.scale(ratio, ratio);

        // Vẽ hình ảnh
        ctx.drawImage(img, 0, 0);

        ctx.restore();
      };
    }
  }, [image, position]);

  useEffect(() => {
    if (image) {
      drawImage();
    }
  }, [scale, position]);

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Áp dụng các phép biến đổi
      ctx.translate(position.x, position.y);
      ctx.scale(scale, scale);

      // Vẽ hình ảnh
      ctx.drawImage(img, 0, 0);

      ctx.restore();
    };
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    let newScale = scale;

    if (delta < 0) {
      // Zoom in
      newScale = scale * 1.1;
    } else {
      // Zoom out
      newScale = scale / 1.1;
    }

    // Giới hạn scale
    newScale = Math.min(Math.max(newScale, initialScale * 0.5), initialScale * 5);
    setScale(newScale);
  };

  const handleMouseDown = (e) => {
    setIsPanning(true);
    setStartCoords({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;

    const x = e.clientX - startCoords.x;
    const y = e.clientY - startCoords.y;
    setPosition({ x, y });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%', // Bạn có thể điều chỉnh chiều cao phù hợp
        border: '1px solid black',
        overflow: 'hidden',
        position: 'relative',
        cursor: isPanning ? 'grabbing' : 'grab',
        textAlign:'center',
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {image ? (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      ) : (
        <div>Không có hình ảnh để hiển thị</div>
      )}
    </div>
  );
}

export default ImageDisplay;
