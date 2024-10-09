import React, { useContext, useRef, useEffect } from "react";
import { ImageContext } from "@/context/ImageContext";

const Cutout = () => {
  const {
    imageParameters: parameters,
    currentImage,
  } = useContext(ImageContext);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = React.useState(false);

  useEffect(() => {
    if (parameters && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = parameters.width;
      canvas.height = parameters.height;

      // Đặt vị trí canvas dựa trên top và left
      canvas.style.position = "absolute";
      canvas.style.top = `${parameters.top}px`;
      canvas.style.left = `${parameters.left}px`;
      canvas.style.zIndex = 10;

      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.strokeStyle = "red";
      context.lineWidth = 10;
      contextRef.current = context;
    }
  }, [parameters]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (isWithinBounds(offsetX, offsetY)) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
    nativeEvent.preventDefault();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    if (isWithinBounds(offsetX, offsetY)) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
    nativeEvent.preventDefault();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const isWithinBounds = (x, y) => {
    return x >= 0 && x <= parameters.width && y >= 0 && y <= parameters.height;
  };

  const getCanvasImageData = () => {
    if (canvasRef.current && contextRef.current) {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      return imageData;
    }
    return null;
  };

  const getDrawnArea = () => {
    const imageData = getCanvasImageData();
    if (imageData) {
      const { data, width, height } = imageData;
      let minX = width, minY = height, maxX = 0, maxY = 0;
      let hasDrawn = false;

      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha !== 0) {
          hasDrawn = true;
          const pixelIndex = i / 4;
          const x = pixelIndex % width;
          const y = Math.floor(pixelIndex / width);
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }

      if (hasDrawn) {
        const drawnArea = { minX, minY, maxX, maxY };
        console.log('Vùng đã vẽ:', drawnArea);
        // Xử lý thêm nếu cần
      } else {
        console.log('Không phát hiện vùng vẽ');
      }
    }
  };

  const createMask = () => {
    const imageData = getCanvasImageData();
    if (imageData) {
      const { data, width, height } = imageData;
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskContext = maskCanvas.getContext('2d');
      const maskImageData = maskContext.createImageData(width, height);
  
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha !== 0) {
          // Đặt pixel mask thành trắng
          maskImageData.data[i] = 255;
          maskImageData.data[i + 1] = 255;
          maskImageData.data[i + 2] = 255;
          maskImageData.data[i + 3] = 255;
        } else {
          // Đặt pixel mask thành đen hoặc trong suốt
          maskImageData.data[i + 3] = 0;
        }
      }
  
      maskContext.putImageData(maskImageData, 0, 0);
      const maskDataURL = maskCanvas.toDataURL();
      console.log('Mask Data URL:', maskDataURL);
      // Bạn có thể sử dụng maskDataURL theo nhu cầu
    }
  };
  

  const applyMaskToImage = () => {
    const imageData = getCanvasImageData();
    if (imageData && currentImage) {
      const { width, height } = imageData;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
  
      const img = new Image();
      img.src = currentImage;
      img.onload = () => {
        context.drawImage(img, 0, 0, width, height);
  
        // Áp dụng mask
        context.globalCompositeOperation = 'destination-in';
        context.drawImage(canvasRef.current, 0, 0);
  
        const resultDataURL = canvas.toDataURL();
        console.log('Result Data URL:', resultDataURL);
        // Sử dụng resultDataURL theo nhu cầu
      };
    }
  };
  

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
       <button onClick={setToDraw}>.</button>
      <button onClick={getDrawnArea}>Lấy Vùng Vẽ</button>
      <button onClick={createMask}>Tạo Mask</button>
      <button onClick={applyMaskToImage}>Áp Dụng Mask Lên Hình Ảnh</button>
    </div>
  );
};

export default Cutout;
