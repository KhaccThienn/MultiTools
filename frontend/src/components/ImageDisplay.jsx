import React, { useRef, useEffect, useState, useContext } from 'react';
import { ImageContext } from '@/context/ImageContext';
import react from 'react';

function ImageDisplay({ image, onImageLoad }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [initialScale, setInitialScale] = useState(1);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 }); // Kích thước gốc của hình ảnh

  const { setImageData } = useContext(ImageContext);

  const updateImageData = () => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Tính toán lại width và height dựa trên scale
    const updatedWidth = imgDimensions.width * scale;
    const updatedHeight = imgDimensions.height * scale;

    // Cập nhật kích thước và vị trí ảnh dựa trên scale và position
    const updatedData = {
      width: updatedWidth,
      height: updatedHeight,
      top: rect.top + position.y,
      left: rect.left + position.x,
    };

    setImageData(updatedData);
    console.log('Updated Image Data:', updatedData);
  };

  const handleImageLoad = () => {
    updateImageData();
  };

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const ctx = canvas.getContext('2d');

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Lưu kích thước ban đầu của hình ảnh
        setImgDimensions({ width: img.width, height: img.height });

        const hRatio = containerWidth / img.width;
        const vRatio = containerHeight / img.height;
        const ratio = Math.min(hRatio, vRatio);

        setInitialScale(ratio);
        setScale(ratio);

        canvas.width = containerWidth;
        canvas.height = containerHeight;

        drawImage(img, { x: 0, y: 0 }, ratio);

        handleImageLoad();
      };
    }
  }, [image]);

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        drawImage(img, position, scale);
        updateImageData();  // Cập nhật khi vị trí hoặc kích thước thay đổi
      };
    }
  }, [scale, position]);

  const drawImage = (img, position, scale) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(position.x, position.y); // Áp dụng vị trí
    ctx.scale(scale, scale); // Áp dụng tỷ lệ
    ctx.drawImage(img, 0, 0); // Vẽ hình ảnh từ góc (0,0)
    ctx.restore();
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    let newScale = scale;

    if (delta < 0) {
      newScale = scale * 1.1;
    } else {
      newScale = scale / 1.1;
    }

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

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid black',
        overflow: 'hidden',
        position: 'relative',
        cursor: isPanning ? 'grabbing' : 'grab',
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
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
