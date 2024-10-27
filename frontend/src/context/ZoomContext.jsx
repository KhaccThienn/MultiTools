import React, { createContext, useContext, useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

// Tạo ngữ cảnh cho Zoom
const ZoomContext = createContext();

// ZoomProvider bọc quanh các component con
export const ZoomProvider = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  // Chỉ render `TransformWrapper` khi client đã "mount"
  if (!isClient) {
    return null; // Hoặc bạn có thể render một spinner ở đây
  }

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={20}
      limitToBounds={true}
    >
      {({ zoomIn, zoomOut, resetTransform,scale , positionX, positionY }) => (
        <ZoomContext.Provider
          value={{
            zoomIn,
            zoomOut,
            resetTransform,
            scale,
            positionX,
            positionY,
          }}
        >
          {children}
        </ZoomContext.Provider>
      )}
    </TransformWrapper>
  );
};

// Hook để sử dụng ngữ cảnh Zoom
export const useZoom = () => useContext(ZoomContext);

// Component chứa phần nội dung có thể zoom/pan
export const ZoomableContent = ({ children }) => {

  return (
    <TransformComponent
    wrapperStyle={{ overflow: "visible" }} // Ghi đè overflow thành visible
    >
      {children}
    </TransformComponent>
  );
};
